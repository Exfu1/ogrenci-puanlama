import { useState, useRef, useEffect } from 'react';

export default function Settings({ onBack, criteria, onAddCriteria, onUpdateCriteria, onDeleteCriteria, onResetCriteria, classCount, studentCount }) {
    const [isAddingCriteria, setIsAddingCriteria] = useState(false);
    const [newCriteriaName, setNewCriteriaName] = useState('');
    const [newCriteriaMax, setNewCriteriaMax] = useState('10');
    const [editingId, setEditingId] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isAddingCriteria && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 100);
        }
    }, [isAddingCriteria]);

    const handleAddCriteria = () => {
        if (!newCriteriaName.trim()) return;
        onAddCriteria(newCriteriaName, parseInt(newCriteriaMax) || 10);
        setNewCriteriaName('');
        setNewCriteriaMax('10');
        setIsAddingCriteria(false);
    };

    const handleExportData = () => {
        try {
            const data = localStorage.getItem('ogrenci_puanlama_data_v2');
            if (!data) {
                alert('Dışa aktarılacak veri yok!');
                return;
            }

            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ogrenci_puanlari_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            alert('Dışa aktarma başarısız: ' + error.message);
        }
    };

    const handleClearData = () => {
        if (confirm('Tüm veriler silinecek. Emin misiniz?')) {
            localStorage.removeItem('ogrenci_puanlama_data_v2');
            window.location.reload();
        }
    };

    const totalMaxScore = criteria.reduce((sum, c) => sum + c.maxScore, 0);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 pb-28">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50">
                <div className="max-w-lg mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-white">Ayarlar</h1>
                            <p className="text-slate-400 text-sm">Kriterleri düzenle</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
                {/* İstatistikler */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                        <span>📊</span> İstatistikler
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-white">{classCount}</p>
                            <p className="text-slate-400 text-xs">Sınıf</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{studentCount}</p>
                            <p className="text-slate-400 text-xs">Öğrenci</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-indigo-400">{totalMaxScore}</p>
                            <p className="text-slate-400 text-xs">Max Puan</p>
                        </div>
                    </div>
                </div>

                {/* Puanlama Kriterleri */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-medium flex items-center gap-2">
                            <span>📝</span> Puanlama Kriterleri
                        </h3>
                        <button
                            onClick={() => setIsAddingCriteria(true)}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
                        >
                            + Ekle
                        </button>
                    </div>

                    <div className="space-y-2">
                        {criteria.map((c) => (
                            <CriteriaItem
                                key={c.id}
                                criteria={c}
                                isEditing={editingId === c.id}
                                onEdit={() => setEditingId(c.id)}
                                onSave={(updates) => {
                                    onUpdateCriteria(c.id, updates);
                                    setEditingId(null);
                                }}
                                onCancel={() => setEditingId(null)}
                                onDelete={() => onDeleteCriteria(c.id)}
                                canDelete={criteria.length > 1}
                            />
                        ))}
                    </div>

                    {/* Yeni Kriter Ekleme */}
                    {isAddingCriteria && (
                        <div className="mt-4 p-3 bg-slate-900/50 rounded-xl border border-indigo-500/30">
                            <div className="flex gap-2 mb-3">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={newCriteriaName}
                                    onChange={(e) => setNewCriteriaName(e.target.value)}
                                    placeholder="Kriter adı..."
                                    className="flex-1 h-10 px-3 rounded-lg bg-slate-800 border border-slate-600 text-white text-sm outline-none focus:border-indigo-500"
                                />
                                <input
                                    type="number"
                                    value={newCriteriaMax}
                                    onChange={(e) => setNewCriteriaMax(e.target.value)}
                                    placeholder="Max"
                                    min="1"
                                    max="100"
                                    className="w-20 h-10 px-3 rounded-lg bg-slate-800 border border-slate-600 text-white text-sm text-center outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsAddingCriteria(false)}
                                    className="flex-1 h-10 rounded-lg bg-slate-700 text-white text-sm font-medium"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleAddCriteria}
                                    className="flex-1 h-10 rounded-lg bg-indigo-600 text-white text-sm font-medium"
                                >
                                    Ekle
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Sıfırla butonu */}
                    <button
                        onClick={onResetCriteria}
                        className="w-full mt-4 h-10 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-400 text-sm font-medium transition-colors"
                    >
                        Varsayılana Sıfırla
                    </button>
                </div>

                {/* Veri Yönetimi */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                        <span>💾</span> Veri Yönetimi
                    </h3>
                    <div className="space-y-3">
                        <button
                            onClick={handleExportData}
                            className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Verileri Dışa Aktar
                        </button>
                        <button
                            onClick={handleClearData}
                            className="w-full h-12 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 font-medium transition-colors border border-red-600/30"
                        >
                            Tüm Verileri Sil
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CriteriaItem({ criteria, isEditing, onEdit, onSave, onCancel, onDelete, canDelete }) {
    const [name, setName] = useState(criteria.name);
    const [maxScore, setMaxScore] = useState(criteria.maxScore.toString());

    if (isEditing) {
        return (
            <div className="p-3 bg-slate-900/50 rounded-xl border border-indigo-500/30">
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="flex-1 h-10 px-3 rounded-lg bg-slate-800 border border-slate-600 text-white text-sm outline-none focus:border-indigo-500"
                        autoFocus
                    />
                    <input
                        type="number"
                        value={maxScore}
                        onChange={(e) => setMaxScore(e.target.value)}
                        min="1"
                        max="100"
                        className="w-20 h-10 px-3 rounded-lg bg-slate-800 border border-slate-600 text-white text-sm text-center outline-none focus:border-indigo-500"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onCancel}
                        className="flex-1 h-9 rounded-lg bg-slate-700 text-white text-sm"
                    >
                        İptal
                    </button>
                    {canDelete && (
                        <button
                            onClick={onDelete}
                            className="h-9 px-4 rounded-lg bg-red-600/20 text-red-400 text-sm"
                        >
                            Sil
                        </button>
                    )}
                    <button
                        onClick={() => onSave({ name, maxScore: parseInt(maxScore) || 10 })}
                        className="flex-1 h-9 rounded-lg bg-indigo-600 text-white text-sm"
                    >
                        Kaydet
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={onEdit}
            className="flex items-center justify-between p-3 bg-slate-900/30 rounded-xl cursor-pointer hover:bg-slate-900/50 transition-colors"
        >
            <div className="flex items-center gap-3">
                <span className="text-xl">{criteria.icon}</span>
                <span className="text-white">{criteria.name}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-indigo-400 font-bold">{criteria.maxScore}</span>
                <span className="text-slate-500 text-sm">puan</span>
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </div>
    );
}
