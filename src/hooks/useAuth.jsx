import { useState, useEffect, useCallback, createContext, useContext } from 'react';

const AUTH_STORAGE_KEY = 'ogrenci_auth';
const USERS_STORAGE_KEY = 'ogrenci_users';

// Auth context
const AuthContext = createContext(null);

// Check if localStorage is available (important for iOS Safari private mode)
const isStorageAvailable = () => {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

// Kullanıcıları localStorage'dan oku
const loadUsers = () => {
    if (!isStorageAvailable()) {
        console.warn('localStorage is not available');
        return {};
    }
    try {
        const data = localStorage.getItem(USERS_STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch (e) {
        console.error('Error loading users:', e);
        return {};
    }
};

// Kullanıcıları kaydet
const saveUsers = (users) => {
    if (!isStorageAvailable()) {
        throw new Error('localStorage kullanılamıyor. Lütfen gizli gezinme modunu kapatın.');
    }
    try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
        console.error('Error saving users:', e);
        throw new Error('Veri kaydedilemedi. Depolama alanı dolmuş olabilir.');
    }
};

// Oturum bilgisini oku
const loadSession = () => {
    if (!isStorageAvailable()) {
        return null;
    }
    try {
        const data = localStorage.getItem(AUTH_STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Error loading session:', e);
        return null;
    }
};

// Oturum bilgisini kaydet
const saveSession = (session) => {
    if (!isStorageAvailable()) {
        return;
    }
    try {
        if (session) {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
        } else {
            localStorage.removeItem(AUTH_STORAGE_KEY);
        }
    } catch (e) {
        console.error('Error saving session:', e);
    }
};

// Basit hash fonksiyonu (güvenlik için gerçek uygulamada bcrypt kullanılmalı)
const simpleHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [storageError, setStorageError] = useState(null);

    // İlk yükleme - oturum kontrolü
    useEffect(() => {
        if (!isStorageAvailable()) {
            setStorageError('localStorage kullanılamıyor. Lütfen gizli gezinme modunu kapatın ve sayfayı yenileyin.');
            setIsLoading(false);
            return;
        }
        const session = loadSession();
        if (session) {
            const users = loadUsers();
            if (users[session.username]) {
                setUser({ username: session.username });
            } else {
                saveSession(null);
            }
        }
        setIsLoading(false);
    }, []);

    // Kayıt ol
    const signup = useCallback((username, password) => {
        const users = loadUsers();

        if (!username || username.length < 3) {
            return { success: false, error: 'Kullanıcı adı en az 3 karakter olmalı' };
        }

        if (!password || password.length < 4) {
            return { success: false, error: 'Şifre en az 4 karakter olmalı' };
        }

        if (users[username.toLowerCase()]) {
            return { success: false, error: 'Bu kullanıcı adı zaten kayıtlı' };
        }

        const normalizedUsername = username.toLowerCase();
        users[normalizedUsername] = {
            username: normalizedUsername,
            displayName: username,
            passwordHash: simpleHash(password),
            createdAt: new Date().toISOString(),
            data: {
                classes: [],
                criteria: null // null = varsayılan kriterleri kullan
            }
        };

        saveUsers(users);
        setUser({ username: normalizedUsername });
        saveSession({ username: normalizedUsername });

        return { success: true };
    }, []);

    // Giriş yap
    const login = useCallback((username, password) => {
        const users = loadUsers();
        const normalizedUsername = username.toLowerCase();
        const userRecord = users[normalizedUsername];

        if (!userRecord) {
            return { success: false, error: 'Kullanıcı bulunamadı' };
        }

        if (userRecord.passwordHash !== simpleHash(password)) {
            return { success: false, error: 'Şifre yanlış' };
        }

        setUser({ username: normalizedUsername });
        saveSession({ username: normalizedUsername });

        return { success: true };
    }, []);

    // Çıkış yap
    const logout = useCallback(() => {
        setUser(null);
        saveSession(null);
    }, []);

    // Kullanıcı verisini al
    const getUserData = useCallback(() => {
        if (!user) return null;
        const users = loadUsers();
        return users[user.username]?.data || { classes: [], criteria: null };
    }, [user]);

    // Kullanıcı verisini kaydet
    const saveUserData = useCallback((data) => {
        if (!user) return;
        const users = loadUsers();
        if (users[user.username]) {
            users[user.username].data = data;
            saveUsers(users);
        }
    }, [user]);

    // Kullanıcı görünen adını al
    const getDisplayName = useCallback(() => {
        if (!user) return '';
        const users = loadUsers();
        return users[user.username]?.displayName || user.username;
    }, [user]);

    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        storageError,
        signup,
        login,
        logout,
        getUserData,
        saveUserData,
        getDisplayName
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
