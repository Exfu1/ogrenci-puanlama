// Puanlama kriterleri
export const SCORE_CRITERIA = [
    {
        id: 'kitap_defter',
        name: 'Kitap/Defter Getirme',
        maxScore: 10,
        icon: '📚'
    },
    {
        id: 'odevler',
        name: 'Ödevler',
        maxScore: 20,
        icon: '📝'
    },
    {
        id: 'dua_ezberi',
        name: 'Dua Ezberi',
        maxScore: 10,
        icon: '🤲'
    },
    {
        id: 'derse_katilim',
        name: 'Derse Katılım',
        maxScore: 20,
        icon: '🙋'
    },
    {
        id: 'davranis',
        name: 'Davranış',
        maxScore: 20,
        icon: '⭐'
    },
    {
        id: 'defter_kontrol',
        name: 'Defter Kontrol',
        maxScore: 20,
        icon: '✅'
    }
];

// Toplam max puan
export const MAX_TOTAL_SCORE = SCORE_CRITERIA.reduce((sum, c) => sum + c.maxScore, 0);

// Puan renk kodlaması
export const getScoreColor = (score) => {
    if (score >= 90) return { bg: 'bg-emerald-500', text: 'text-emerald-500', gradient: 'from-emerald-400 to-emerald-600' };
    if (score >= 70) return { bg: 'bg-blue-500', text: 'text-blue-500', gradient: 'from-blue-400 to-blue-600' };
    if (score >= 50) return { bg: 'bg-orange-500', text: 'text-orange-500', gradient: 'from-orange-400 to-orange-600' };
    return { bg: 'bg-red-500', text: 'text-red-500', gradient: 'from-red-400 to-red-600' };
};

// Başlangıç puanları
export const getDefaultScores = () => {
    const scores = {};
    SCORE_CRITERIA.forEach(c => {
        scores[c.id] = 0;
    });
    return scores;
};

// Unique ID oluştur
export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};
