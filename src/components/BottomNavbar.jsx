export default function BottomNavbar({ currentPage, onNavigate, onAddStudent }) {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 safe-bottom z-50">
            <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-4">
                {/* Ana Sayfa */}
                <button
                    onClick={() => onNavigate('home')}
                    className={`flex flex-col items-center gap-1 py-2 px-6 rounded-xl transition-all ${currentPage === 'home'
                            ? 'bg-indigo-600/20 text-indigo-400'
                            : 'text-slate-400 hover:text-white'
                        }`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                    </svg>
                    <span className="text-xs font-medium">Ana Sayfa</span>
                </button>

                {/* Yeni Öğrenci Ekle */}
                <button
                    onClick={onAddStudent}
                    className="flex flex-col items-center gap-1 -mt-6"
                >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 active:scale-95 transition-transform">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <span className="text-xs font-medium text-slate-400">Ekle</span>
                </button>

                {/* Ayarlar */}
                <button
                    onClick={() => onNavigate('settings')}
                    className={`flex flex-col items-center gap-1 py-2 px-6 rounded-xl transition-all ${currentPage === 'settings'
                            ? 'bg-indigo-600/20 text-indigo-400'
                            : 'text-slate-400 hover:text-white'
                        }`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs font-medium">Ayarlar</span>
                </button>
            </div>
        </nav>
    );
}
