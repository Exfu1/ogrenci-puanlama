import { useState } from 'react';
import { getScoreColor } from '../utils/constants';

export default function StudentCard({ student, onSelect, onDelete, isDraggable, onDragStart, onDragEnd }) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const scoreColor = getScoreColor(student.total);

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

    const handleLongPress = () => {
        setShowDeleteConfirm(true);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(student.id);
    };

    const handleCancelDelete = (e) => {
        e.stopPropagation();
        setShowDeleteConfirm(false);
    };

    const handleDragStart = (e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', student.id);
        onDragStart && onDragStart();
    };

    return (
        <div
            className="relative overflow-hidden animate-slide-up"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onContextMenu={(e) => {
                e.preventDefault();
                handleLongPress();
            }}
            draggable={isDraggable}
            onDragStart={handleDragStart}
            onDragEnd={onDragEnd}
        >
            <div
                onClick={() => !showDeleteConfirm && onSelect(student.id)}
                className={`
          relative bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 
          border border-slate-700/50 cursor-pointer
          hover:bg-slate-700/80 hover:border-slate-600/50
          transition-all duration-300 active:scale-[0.98]
          ${showDeleteConfirm ? 'translate-x-[-80px]' : 'translate-x-0'}
        `}
            >
                <div className="flex items-center justify-between">
                    {/* Sol: Drag handle + İsim */}
                    <div className="flex-1 min-w-0 flex items-center gap-3">
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
                        <div>
                            <h3 className="text-white font-semibold text-lg truncate">
                                {student.name}
                            </h3>
                            <p className="text-slate-400 text-sm mt-1">
                                Puanı görüntüle →
                            </p>
                        </div>
                    </div>

                    {/* Sağ: Toplam Puan */}
                    <div className={`
            w-20 h-20 rounded-2xl flex flex-col items-center justify-center
            bg-gradient-to-br ${scoreColor.gradient} shadow-lg
          `}>
                        <span className="text-white text-3xl font-bold">
                            {student.total}
                        </span>
                        <span className="text-white/80 text-xs">puan</span>
                    </div>
                </div>
            </div>

            {/* Silme butonu (swipe sonrası görünür) */}
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
