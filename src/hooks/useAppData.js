import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { generateId } from '../utils/constants';

// Varsayılan puanlama kriterleri
const DEFAULT_CRITERIA = [
    { id: 'kitap_defter', name: 'Kitap/Defter Getirme', maxScore: 10, icon: '📚' },
    { id: 'odevler', name: 'Ödevler', maxScore: 20, icon: '📝' },
    { id: 'dua_ezberi', name: 'Dua Ezberi', maxScore: 10, icon: '🤲' },
    { id: 'derse_katilim', name: 'Derse Katılım', maxScore: 20, icon: '🙋' },
    { id: 'davranis', name: 'Davranış', maxScore: 20, icon: '⭐' },
    { id: 'defter_kontrol', name: 'Defter Kontrol', maxScore: 20, icon: '✅' }
];

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
    const { user, getUserData, saveUserData, isAuthenticated } = useAuth();
    const [classes, setClasses] = useState([]);
    const [criteria, setCriteria] = useState(DEFAULT_CRITERIA);
    const [isLoaded, setIsLoaded] = useState(false);

    // Kullanıcı değiştiğinde verileri yükle
    useEffect(() => {
        if (isAuthenticated && user) {
            const data = getUserData();
            if (data) {
                setClasses(data.classes || []);
                setCriteria(data.criteria || DEFAULT_CRITERIA);
            }
            setIsLoaded(true);
        } else {
            setClasses([]);
            setCriteria(DEFAULT_CRITERIA);
            setIsLoaded(false);
        }
    }, [isAuthenticated, user, getUserData]);

    // Değişiklikleri kaydet
    useEffect(() => {
        if (isLoaded && isAuthenticated) {
            saveUserData({ classes, criteria });
        }
    }, [classes, criteria, isLoaded, isAuthenticated, saveUserData]);

    // ========== SINIF İŞLEMLERİ ==========

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

    const deleteClass = useCallback((classId) => {
        setClasses(prev => prev.filter(c => c.id !== classId));
    }, []);

    const updateClassName = useCallback((classId, name) => {
        setClasses(prev => prev.map(c =>
            c.id === classId ? { ...c, name: name.trim() } : c
        ));
    }, []);

    const getClass = useCallback((classId) => {
        return classes.find(c => c.id === classId);
    }, [classes]);

    // ========== ÖĞRENCİ İŞLEMLERİ ==========

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

    const deleteStudent = useCallback((classId, studentId) => {
        setClasses(prev => prev.map(c => {
            if (c.id !== classId) return c;
            return { ...c, students: c.students.filter(s => s.id !== studentId) };
        }));
    }, []);

    const getStudent = useCallback((classId, studentId) => {
        const classObj = classes.find(c => c.id === classId);
        if (!classObj) return null;
        return classObj.students.find(s => s.id === studentId);
    }, [classes]);

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

    const addCriteria = useCallback((name, maxScore, icon = '📌') => {
        const newCriteria = {
            id: generateId(),
            name: name.trim(),
            maxScore: Math.max(1, Math.min(100, parseInt(maxScore) || 10)),
            icon
        };
        setCriteria(prev => [...prev, newCriteria]);

        setClasses(prev => prev.map(c => ({
            ...c,
            students: c.students.map(s => ({
                ...s,
                scores: { ...s.scores, [newCriteria.id]: 0 }
            }))
        })));

        return newCriteria;
    }, []);

    const deleteCriteria = useCallback((criteriaId) => {
        setCriteria(prev => prev.filter(c => c.id !== criteriaId));

        setClasses(prev => prev.map(c => ({
            ...c,
            students: c.students.map(s => {
                const newScores = { ...s.scores };
                delete newScores[criteriaId];
                return { ...s, scores: newScores, total: calculateTotal(newScores) };
            })
        })));
    }, []);

    const updateCriteria = useCallback((criteriaId, updates) => {
        setCriteria(prev => prev.map(c => {
            if (c.id !== criteriaId) return c;
            const updated = { ...c, ...updates };
            if (updates.maxScore !== undefined) {
                updated.maxScore = Math.max(1, Math.min(100, parseInt(updates.maxScore) || 10));
            }
            return updated;
        }));

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

    const resetCriteria = useCallback(() => {
        setCriteria(DEFAULT_CRITERIA);
    }, []);

    const getMaxTotal = useCallback(() => {
        return criteria.reduce((sum, c) => sum + c.maxScore, 0);
    }, [criteria]);

    return {
        classes,
        criteria,
        isLoaded,
        addClass,
        deleteClass,
        updateClassName,
        getClass,
        addStudent,
        deleteStudent,
        getStudent,
        updateScore,
        searchStudents,
        addCriteria,
        deleteCriteria,
        updateCriteria,
        resetCriteria,
        getMaxTotal
    };
};
