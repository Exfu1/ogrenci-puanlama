import { useState } from 'react';

export default function AddStudentModal({ isOpen, onClose, onAdd }) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName) {
            setError('Lütfen öğrenci adını girin');
            return;
        }

        if (trimmedName.length < 2) {
            setError('İsim en az 2 karakter olmalı');
            return;
        }

        onAdd(trimmedName);
        setName('');
        setError('');
        onClose();
    };

    const handleClose = () => {
        setName('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 animate-fade-in"
            onClick={handleClose}
        >
            <div
                className="w-full max-w-md bg-slate-800 rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Handle bar (mobil için) */}
                <div className="w-12 h-1.5 bg-slate-600 rounded-full mx-auto mb-6 sm:hidden" />

                {/* Başlık */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Yeni Öğrenci Ekle</h2>
                    <button
                        onClick={handleClose}
                        className="w-10 h-10 rounded-xl bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
                    >
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                            Öğrenci Adı
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError('');
                            }}
                            placeholder="Adı ve soyadı girin..."
                            autoFocus
                            className="w-full h-14 px-4 rounded-xl bg-slate-900 border-2 border-slate-600 focus:border-indigo-500 text-white placeholder-slate-500 outline-none transition-all text-lg"
                        />
                        {error && (
                            <p className="mt-2 text-red-400 text-sm">{error}</p>
                        )}
                    </div>

                    {/* Butonlar */}
                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 h-14 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 h-14 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition-all active:scale-[0.98]"
                        >
                            Ekle
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
