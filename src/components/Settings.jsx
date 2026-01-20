export default function Settings({ onBack, studentCount }) {
    const handleExportData = () => {
        try {
            const data = localStorage.getItem('ogrenci_puanlama_data');
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
        if (confirm('Tüm öğrenci verileri silinecek. Emin misiniz?')) {
            localStorage.removeItem('ogrenci_puanlama_data');
            window.location.reload();
        }
    };

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
                            <p className="text-slate-400 text-sm">Uygulama ayarları</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ayarlar Listesi */}
            <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
                {/* Hakkında */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                        <span>ℹ️</span> Hakkında
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Uygulama</span>
                            <span className="text-white">Öğrenci Puanlama</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Sürüm</span>
                            <span className="text-white">1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Kayıtlı Öğrenci</span>
                            <span className="text-white">{studentCount}</span>
                        </div>
                    </div>
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

                {/* Puanlama Kriterleri Bilgi */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                        <span>📊</span> Puanlama Kriterleri
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-400">📚 Kitap/Defter Getirme</span>
                            <span className="text-white">0-10 puan</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">📝 Ödevler</span>
                            <span className="text-white">0-20 puan</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">🤲 Dua Ezberi</span>
                            <span className="text-white">0-10 puan</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">🙋 Derse Katılım</span>
                            <span className="text-white">0-20 puan</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">⭐ Davranış</span>
                            <span className="text-white">0-20 puan</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">✅ Defter Kontrol</span>
                            <span className="text-white">0-20 puan</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-700">
                            <span className="text-white font-medium">Toplam</span>
                            <span className="text-indigo-400 font-bold">100 puan</span>
                        </div>
                    </div>
                </div>

                {/* Renk Kodları */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                        <span>🎨</span> Renk Kodları
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-emerald-500" />
                            <span className="text-slate-400">90-100: Mükemmel</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-blue-500" />
                            <span className="text-slate-400">70-89: İyi</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-orange-500" />
                            <span className="text-slate-400">50-69: Orta</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-red-500" />
                            <span className="text-slate-400">0-49: Zayıf</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
