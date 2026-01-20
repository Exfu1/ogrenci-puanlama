import { useState } from 'react';
import SearchBar from './SearchBar';
import { getScoreColor } from '../utils/constants';

export default function ClassList({ classes, onSelectClass, onDeleteClass, displayName, onLogout }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredClasses = searchQuery.trim()
        ? classes.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : classes;

    // Sınıfın ortalama puanını hesapla
    const getClassAverage = (classObj) => {
        if (!classObj.students || classObj.students.length === 0) return 0;
        const total = classObj.students.reduce((sum, s) => sum + s.total, 0);
        return Math.round(total / classObj.students.length);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 pb-28">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 px-4 pt-6 pb-4">
                <div className="max-w-lg mx-auto">
                    {/* User bar */}
                    {displayName && (
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">{displayName.charAt(0).toUpperCase()}</span>
                                </div>
                                <span className="text-slate-300 text-sm">Merhaba, <span className="font-medium text-white">{displayName}</span></span>
                            </div>
                            <button
                                onClick={onLogout}
                                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-sm transition-colors"
                            >
                                Çıkış
                            </button>
                        </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Sınıflar</h1>
                            <p className="text-slate-400 text-sm mt-1">
                                {classes.length} sınıf kayıtlı
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <span className="text-2xl">🏫</span>
                        </div>
                    </div>

                    <SearchBar onSearch={setSearchQuery} placeholder="Sınıf ara..." />
                </div>
            </div>

            {/* Sınıf Listesi */}
            <div className="max-w-lg mx-auto px-4 py-4">
                {classes.length === 0 ? (
                    <div className="text-center py-16 animate-fade-in">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-slate-800 flex items-center justify-center">
                            <span className="text-5xl">📚</span>
                        </div>
                        <h3 className="text-white text-lg font-semibold mb-2">
                            Henüz sınıf yok
                        </h3>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto">
                            Alt menüdeki + butonuna tıklayarak ilk sınıfınızı ekleyin
                        </p>
                    </div>
                ) : filteredClasses.length === 0 ? (
                    <div className="text-center py-16 animate-fade-in">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-800 flex items-center justify-center">
                            <span className="text-4xl">🔍</span>
                        </div>
                        <h3 className="text-white font-semibold mb-1">
                            Sonuç bulunamadı
                        </h3>
                        <p className="text-slate-400 text-sm">
                            "{searchQuery}" ile eşleşen sınıf yok
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredClasses.map((classObj, index) => {
                            const average = getClassAverage(classObj);
                            const scoreColor = getScoreColor(average);

                            return (
                                <div
                                    key={classObj.id}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                    className="animate-slide-up"
                                >
                                    <ClassCard
                                        classObj={classObj}
                                        average={average}
                                        scoreColor={scoreColor}
                                        onSelect={onSelectClass}
                                        onDelete={onDeleteClass}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

function ClassCard({ classObj, average, scoreColor, onSelect, onDelete }) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(classObj.id);
    };

    const handleCancelDelete = (e) => {
        e.stopPropagation();
        setShowDeleteConfirm(false);
    };

    return (
        <div
            className="relative overflow-hidden"
            onContextMenu={(e) => {
                e.preventDefault();
                setShowDeleteConfirm(true);
            }}
        >
            <div
                onClick={() => !showDeleteConfirm && onSelect(classObj.id)}
                className={`
          relative bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 
          border border-slate-700/50 cursor-pointer
          hover:bg-slate-700/80 hover:border-slate-600/50
          transition-all duration-300 active:scale-[0.98]
          ${showDeleteConfirm ? 'translate-x-[-80px]' : 'translate-x-0'}
        `}
            >
                <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                                <span className="text-2xl">📁</span>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg">
                                    {classObj.name}
                                </h3>
                                <p className="text-slate-400 text-sm">
                                    {classObj.students?.length || 0} öğrenci
                                </p>
                            </div>
                        </div>
                    </div>

                    {classObj.students?.length > 0 && (
                        <div className={`
              w-16 h-16 rounded-2xl flex flex-col items-center justify-center
              bg-gradient-to-br ${scoreColor.gradient} shadow-lg
            `}>
                            <span className="text-white text-xl font-bold">{average}</span>
                            <span className="text-white/80 text-xs">ort</span>
                        </div>
                    )}
                </div>
            </div>

            {showDeleteConfirm && (
                <div className="absolute right-0 top-0 bottom-0 flex items-center gap-2 pr-2">
                    <button
                        onClick={handleCancelDelete}
                        className="h-full px-3 rounded-xl bg-slate-600 text-white text-sm font-medium"
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleDelete}
                        className="h-full px-4 rounded-xl bg-red-500 text-white text-sm font-medium"
                    >
                        Sil
                    </button>
                </div>
            )}
        </div>
    );
}
