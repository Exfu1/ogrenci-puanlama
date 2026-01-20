import { useState, useEffect, useCallback } from 'react';
import { generateId } from '../utils/constants';

const STORAGE_KEY = 'ogrenci_puanlama_data_v2';

// Varsayılan puanlama kriterleri
const DEFAULT_CRITERIA = [
    { id: 'kitap_defter', name: 'Kitap/Defter Getirme', maxScore: 10, icon: '📚' },
    { id: 'odevler', name: 'Ödevler', maxScore: 20, icon: '📝' },
    { id: 'dua_ezberi', name: 'Dua Ezberi', maxScore: 10, icon: '🤲' },
    { id: 'derse_katilim', name: 'Derse Katılım', maxScore: 20, icon: '🙋' },
    { id: 'davranis', name: 'Davranış', maxScore: 20, icon: '⭐' },
    { id: 'defter_kontrol', name: 'Defter Kontrol', maxScore: 20, icon: '✅' }
];

// localStorage'dan veri oku
const loadFromStorage = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('localStorage okuma hatası:', error);
    }
    return {
        classes: [],
        criteria: DEFAULT_CRITERIA
    };
};

// localStorage'a veri yaz
const saveToStorage = (data) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('localStorage yazma hatası:', error);
    }
};

// Varsayılan puanları oluştur (dinamik kriterlere göre)
const getDefaultScores = (criteria) => {
    const scores = {};
    criteria.forEach(c => {
        scores[c.id] = 0;
    });
    return scores;
};

// Toplam puanı hesapla
const calculateTotal = (scores) => {
    return Object.values(scores).reduce((sum, score) => sum + score, 0);
};

export const useAppData = () => {
    const [classes, setClasses] = useState([]);
    const [criteria, setCriteria] = useState(DEFAULT_CRITERIA);
    const [isLoaded, setIsLoaded] = useState(false);

    // İlk yükleme
    useEffect(() => {
        const data = loadFromStorage();
        setClasses(data.classes || []);
        setCriteria(data.criteria || DEFAULT_CRITERIA);
        setIsLoaded(true);
    }, []);

    // Değişiklikleri kaydet
    useEffect(() => {
        if (isLoaded) {
            saveToStorage({ classes, criteria });
        }
    }, [classes, criteria, isLoaded]);

    // ========== SINIF İŞLEMLERİ ==========

    // Yeni sınıf ekle
    const addClass = useCallback((name) => {
        const newClass = {
            id: generateId(),
            name: name.trim(),
            students: [],
            createdAt: new Date().toISOString()
        };
        setClasses(prev => [...prev, newClass]);
        return newClass;
    }, []);

    // Sınıf sil
    const deleteClass = useCallback((classId) => {
        setClasses(prev => prev.filter(c => c.id !== classId));
    }, []);

    // Sınıf adını güncelle
    const updateClassName = useCallback((classId, name) => {
        setClasses(prev => prev.map(c =>
            c.id === classId ? { ...c, name: name.trim() } : c
        ));
    }, []);

    // Sınıfı ID ile bul
    const getClass = useCallback((classId) => {
        return classes.find(c => c.id === classId);
    }, [classes]);

    // ========== ÖĞRENCİ İŞLEMLERİ ==========

    // Sınıfa öğrenci ekle
    const addStudent = useCallback((classId, name) => {
        const newStudent = {
            id: generateId(),
            name: name.trim(),
            scores: getDefaultScores(criteria),
            total: 0,
            createdAt: new Date().toISOString()
        };

        setClasses(prev => prev.map(c => {
            if (c.id !== classId) return c;
            return { ...c, students: [...c.students, newStudent] };
        }));

        return newStudent;
    }, [criteria]);

    // Öğrenci sil
    const deleteStudent = useCallback((classId, studentId) => {
        setClasses(prev => prev.map(c => {
            if (c.id !== classId) return c;
            return { ...c, students: c.students.filter(s => s.id !== studentId) };
        }));
    }, []);

    // Öğrenciyi bul
    const getStudent = useCallback((classId, studentId) => {
        const classObj = classes.find(c => c.id === classId);
        if (!classObj) return null;
        return classObj.students.find(s => s.id === studentId);
    }, [classes]);

    // Puan güncelle
    const updateScore = useCallback((classId, studentId, criteriaId, score) => {
        setClasses(prev => prev.map(c => {
            if (c.id !== classId) return c;

            return {
                ...c,
                students: c.students.map(s => {
                    if (s.id !== studentId) return s;

                    const criteriaObj = criteria.find(cr => cr.id === criteriaId);
                    const maxScore = criteriaObj ? criteriaObj.maxScore : 0;
                    const validScore = Math.max(0, Math.min(maxScore, Math.floor(score)));

                    const newScores = { ...s.scores, [criteriaId]: validScore };
                    const newTotal = calculateTotal(newScores);

                    return { ...s, scores: newScores, total: newTotal };
                })
            };
        }));
    }, [criteria]);

    // Sınıftaki öğrencileri ara
    const searchStudents = useCallback((classId, query) => {
        const classObj = classes.find(c => c.id === classId);
        if (!classObj) return [];

        if (!query.trim()) return classObj.students;
        const lowerQuery = query.toLowerCase();
        return classObj.students.filter(s =>
            s.name.toLowerCase().includes(lowerQuery)
        );
    }, [classes]);

    // ========== KRİTER İŞLEMLERİ ==========

    // Kriter ekle
    const addCriteria = useCallback((name, maxScore, icon = '📌') => {
        const newCriteria = {
            id: generateId(),
            name: name.trim(),
            maxScore: Math.max(1, Math.min(100, parseInt(maxScore) || 10)),
            icon
        };
        setCriteria(prev => [...prev, newCriteria]);

        // Tüm öğrencilere yeni kriter için 0 puan ekle
        setClasses(prev => prev.map(c => ({
            ...c,
            students: c.students.map(s => ({
                ...s,
                scores: { ...s.scores, [newCriteria.id]: 0 }
            }))
        })));

        return newCriteria;
    }, []);

    // Kriter sil
    const deleteCriteria = useCallback((criteriaId) => {
        setCriteria(prev => prev.filter(c => c.id !== criteriaId));

        // Tüm öğrencilerden bu kriteri kaldır ve toplamı yeniden hesapla
        setClasses(prev => prev.map(c => ({
            ...c,
            students: c.students.map(s => {
                const newScores = { ...s.scores };
                delete newScores[criteriaId];
                return { ...s, scores: newScores, total: calculateTotal(newScores) };
            })
        })));
    }, []);

    // Kriter güncelle
    const updateCriteria = useCallback((criteriaId, updates) => {
        setCriteria(prev => prev.map(c => {
            if (c.id !== criteriaId) return c;
            const updated = { ...c, ...updates };
            if (updates.maxScore !== undefined) {
                updated.maxScore = Math.max(1, Math.min(100, parseInt(updates.maxScore) || 10));
            }
            return updated;
        }));

        // Max puan değiştiyse öğrenci puanlarını sınırla
        if (updates.maxScore !== undefined) {
            const newMax = Math.max(1, Math.min(100, parseInt(updates.maxScore) || 10));
            setClasses(prev => prev.map(c => ({
                ...c,
                students: c.students.map(s => {
                    const currentScore = s.scores[criteriaId] || 0;
                    if (currentScore > newMax) {
                        const newScores = { ...s.scores, [criteriaId]: newMax };
                        return { ...s, scores: newScores, total: calculateTotal(newScores) };
                    }
                    return s;
                })
            })));
        }
    }, []);

    // Kriterleri sıfırla
    const resetCriteria = useCallback(() => {
        setCriteria(DEFAULT_CRITERIA);
    }, []);

    // Max toplam puanı hesapla
    const getMaxTotal = useCallback(() => {
        return criteria.reduce((sum, c) => sum + c.maxScore, 0);
    }, [criteria]);

    return {
        // State
        classes,
        criteria,
        isLoaded,

        // Sınıf işlemleri
        addClass,
        deleteClass,
        updateClassName,
        getClass,

        // Öğrenci işlemleri
        addStudent,
        deleteStudent,
        getStudent,
        updateScore,
        searchStudents,

        // Kriter işlemleri
        addCriteria,
        deleteCriteria,
        updateCriteria,
        resetCriteria,
        getMaxTotal
    };
};
