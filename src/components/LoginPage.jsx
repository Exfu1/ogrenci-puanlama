import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
    const { login, signup } = useAuth();
    const [isSignup, setIsSignup] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 100);
        }
    }, [isSignup]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (isSignup) {
            if (password !== confirmPassword) {
                setError('Şifreler eşleşmiyor');
                setIsLoading(false);
                return;
            }

            const result = signup(username, password);
            if (!result.success) {
                setError(result.error);
            }
        } else {
            const result = login(username, password);
            if (!result.success) {
                setError(result.error);
            }
        }

        setIsLoading(false);
    };

    const toggleMode = () => {
        setIsSignup(!isSignup);
        setError('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
                        <span className="text-4xl">📚</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Öğrenci Puanlama</h1>
                    <p className="text-slate-400 mt-2">
                        {isSignup ? 'Yeni hesap oluştur' : 'Hesabınıza giriş yapın'}
                    </p>
                </div>

                {/* Form */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/50 animate-slide-up">
                    <form onSubmit={handleSubmit}>
                        {/* Kullanıcı Adı */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                Kullanıcı Adı
                            </label>
                            <input
                                ref={inputRef}
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Kullanıcı adınız..."
                                className="w-full h-14 px-4 rounded-xl bg-slate-900 border-2 border-slate-600 focus:border-indigo-500 text-white placeholder-slate-500 outline-none transition-all text-lg"
                            />
                        </div>

                        {/* Şifre */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                Şifre
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full h-14 px-4 rounded-xl bg-slate-900 border-2 border-slate-600 focus:border-indigo-500 text-white placeholder-slate-500 outline-none transition-all text-lg"
                            />
                        </div>

                        {/* Şifre Tekrar (sadece kayıt için) */}
                        {isSignup && (
                            <div className="mb-4 animate-fade-in">
                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                    Şifre Tekrar
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full h-14 px-4 rounded-xl bg-slate-900 border-2 border-slate-600 focus:border-indigo-500 text-white placeholder-slate-500 outline-none transition-all text-lg"
                                />
                            </div>
                        )}

                        {/* Hata Mesajı */}
                        {error && (
                            <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm animate-fade-in">
                                {error}
                            </div>
                        )}

                        {/* Giriş/Kayıt Butonu */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-lg transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading ? 'Yükleniyor...' : isSignup ? 'Kayıt Ol' : 'Giriş Yap'}
                        </button>
                    </form>

                    {/* Mod Değiştir */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={toggleMode}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            {isSignup ? (
                                <>Zaten hesabınız var mı? <span className="text-indigo-400 font-medium">Giriş Yap</span></>
                            ) : (
                                <>Hesabınız yok mu? <span className="text-indigo-400 font-medium">Kayıt Ol</span></>
                            )}
                        </button>
                    </div>
                </div>

                {/* Alt Bilgi */}
                <p className="text-center text-slate-500 text-sm mt-6">
                    Verileriniz cihazınızda güvenle saklanır
                </p>
            </div>
        </div>
    );
}
