import { useState } from 'react';
import SearchBar from './SearchBar';
import ExcelImportModal from './ExcelImportModal';
import { getScoreColor } from '../utils/constants';

export default function ClassList({ classes, onSelectClass, onDeleteClass, onAddClassWithStudents, onReorderClasses, displayName, onLogout }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

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

    // Drag handlers
    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragOverIndex !== index) {
            setDragOverIndex(index);
        }
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        const dragIndex = draggedIndex;

        if (dragIndex !== null && dragIndex !== dropIndex) {
            onReorderClasses(dragIndex, dropIndex);
        }

        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleImport = (className, studentNames) => {
        if (onAddClassWithStudents) {
            onAddClassWithStudents(className, studentNames);
        }
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
                        <span className="text-2xl">🏫</span>
                    </div>
                </div>

                <div className="flex gap-2 mb-4">
                    <div className="flex-1">
                        <SearchBar onSearch={setSearchQuery} placeholder="Sınıf ara..." />
                    </div>
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="bg-emerald-500/10 text-emerald-400 px-4 rounded-xl flex items-center justify-center hover:bg-emerald-500/20 hover:text-emerald-300 transition-all active:scale-95 border border-emerald-500/20"
                        title="Excel'den İçe Aktar"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </button>
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
                            const originalIndex = classes.findIndex(c => c.id === classObj.id);

                            return (
                                <div
                                    key={classObj.id}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                    className={`animate-slide-up ${draggedIndex === originalIndex ? 'dragging' : ''} ${dragOverIndex === originalIndex ? 'drag-over rounded-2xl' : ''}`}
                                    draggable={!searchQuery.trim()}
                                    onDragStart={(e) => handleDragStart(e, originalIndex)}
                                    onDragOver={(e) => handleDragOver(e, originalIndex)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, originalIndex)}
                                    onDragEnd={handleDragEnd}
                                >
                                    <ClassCard
                                        classObj={classObj}
                                        average={average}
                                        scoreColor={scoreColor}
                                        onSelect={onSelectClass}
                                        onDelete={onDeleteClass}
                                        isDraggable={!searchQuery.trim()}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>


            <ExcelImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImport}
            />
        </div >
    );
}

function ClassCard({ classObj, average, scoreColor, onSelect, onDelete, isDraggable }) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    // Swipe detection
    const minSwipeDistance = 100;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;

        if (isLeftSwipe) {
            setShowDeleteConfirm(true);
        }
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(classObj.id);
        setShowDeleteConfirm(false);
    };

    const handleCancelDelete = (e) => {
        e.stopPropagation();
        setShowDeleteConfirm(false);
    };

    return (
        <div
            className="relative overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
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
                            {/* Drag handle */}
                            {isDraggable && (
                                <div className="drag-handle flex flex-col gap-0.5 p-1 -ml-1 text-slate-500 hover:text-slate-300 transition-colors">
                                    <div className="flex gap-0.5">
                                        <div className="w-1 h-1 bg-current rounded-full"></div>
                                        <div className="w-1 h-1 bg-current rounded-full"></div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        <div className="w-1 h-1 bg-current rounded-full"></div>
                                        <div className="w-1 h-1 bg-current rounded-full"></div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        <div className="w-1 h-1 bg-current rounded-full"></div>
                                        <div className="w-1 h-1 bg-current rounded-full"></div>
                                    </div>
                                </div>
                            )}
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
