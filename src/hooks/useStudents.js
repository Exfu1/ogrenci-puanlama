import { useState, useEffect, useCallback } from 'react';
import { SCORE_CRITERIA, getDefaultScores, generateId } from '../utils/constants';

const STORAGE_KEY = 'ogrenci_puanlama_data';

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
    return { students: [] };
};

// localStorage'a veri yaz
const saveToStorage = (data) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('localStorage yazma hatası:', error);
    }
};

// Toplam puanı hesapla
const calculateTotal = (scores) => {
    return Object.values(scores).reduce((sum, score) => sum + score, 0);
};

export const useStudents = () => {
    const [students, setStudents] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // İlk yükleme
    useEffect(() => {
        const data = loadFromStorage();
        setStudents(data.students || []);
        setIsLoaded(true);
    }, []);

    // Değişiklikleri kaydet
    useEffect(() => {
        if (isLoaded) {
            saveToStorage({ students });
        }
    }, [students, isLoaded]);

    // Yeni öğrenci ekle
    const addStudent = useCallback((name) => {
        const newStudent = {
            id: generateId(),
            name: name.trim(),
            scores: getDefaultScores(),
            total: 0,
            createdAt: new Date().toISOString()
        };
        setStudents(prev => [...prev, newStudent]);
        return newStudent;
    }, []);

    // Öğrenci sil
    const deleteStudent = useCallback((id) => {
        setStudents(prev => prev.filter(s => s.id !== id));
    }, []);

    // Öğrenci adını güncelle
    const updateStudentName = useCallback((id, name) => {
        setStudents(prev => prev.map(s =>
            s.id === id ? { ...s, name: name.trim() } : s
        ));
    }, []);

    // Puan güncelle
    const updateScore = useCallback((studentId, criteriaId, score) => {
        setStudents(prev => prev.map(s => {
            if (s.id !== studentId) return s;

            const criteria = SCORE_CRITERIA.find(c => c.id === criteriaId);
            const maxScore = criteria ? criteria.maxScore : 0;

            // Puanı sınırla
            const validScore = Math.max(0, Math.min(maxScore, Math.floor(score)));

            const newScores = { ...s.scores, [criteriaId]: validScore };
            const newTotal = calculateTotal(newScores);

            return { ...s, scores: newScores, total: newTotal };
        }));
    }, []);

    // Öğrenciyi ID ile bul
    const getStudent = useCallback((id) => {
        return students.find(s => s.id === id);
    }, [students]);

    // Arama yap
    const searchStudents = useCallback((query) => {
        if (!query.trim()) return students;
        const lowerQuery = query.toLowerCase();
        return students.filter(s =>
            s.name.toLowerCase().includes(lowerQuery)
        );
    }, [students]);

    return {
        students,
        isLoaded,
        addStudent,
        deleteStudent,
        updateStudentName,
        updateScore,
        getStudent,
        searchStudents
    };
};
