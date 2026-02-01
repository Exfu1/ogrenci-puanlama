export default function StorageError({ message }) {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700/50 p-8">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white text-center mb-4">
                    Depolama Erişimi Gerekli
                </h2>

                {/* Message */}
                <p className="text-slate-300 text-center mb-6">
                    {message || 'Uygulamanın çalışması için tarayıcı depolama alanına erişim gerekiyor.'}
                </p>

                {/* Instructions */}
                <div className="bg-slate-900/50 rounded-2xl p-6 mb-6 border border-slate-700/30">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <span className="text-xl">🍎</span>
                        iOS/Safari Kullanıcıları için:
                    </h3>
                    <ol className="text-slate-300 text-sm space-y-2 list-decimal list-inside">
                        <li>
                            <strong className="text-white">Gizli Gezinme Modunu</strong> kapatın
                        </li>
                        <li>
                            Safari'de <strong className="text-white">Ayarlar → Safari → Gizlilik</strong> bölümüne gidin
                        </li>
                        <li>
                            <strong className="text-white">"Siteler Arası İzlemeyi Engelle"</strong> seçeneğini kontrol edin
                        </li>
                        <li>
                            Sayfayı yenileyip tekrar deneyin
                        </li>
                    </ol>
                </div>

                {/* Action Button */}
                <button
                    onClick={() => window.location.reload()}
                    className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95"
                >
                    Sayfayı Yenile
                </button>

                {/* Additional Info */}
                <p className="text-slate-400 text-xs text-center mt-6">
                    Bu uygulama verilerinizi yalnızca cihazınızda saklar. Hiçbir veri sunucuya gönderilmez.
                </p>
            </div>
        </div>
    );
}
