import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

export default function ExcelImportModal({ isOpen, onClose, onImport }) {
    const [file, setFile] = useState(null);
    const [className, setClassName] = useState('');
    const [previewData, setPreviewData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setIsLoading(true);
        setError('');

        // Dosya adından varsayılan sınıf adı öner (örn: 6D.xlsx -> 6D)
        const suggestedName = selectedFile.name.replace(/\.[^/.]+$/, "");
        setClassName(suggestedName);

        try {
            const data = await parseExcel(selectedFile);
            setPreviewData(data);
        } catch (err) {
            setError('Dosya okunamadı: ' + err.message);
            setPreviewData([]);
        } finally {
            setIsLoading(false);
        }
    };

    const parseExcel = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });

                    // İlk sayfayı al
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];

                    // JSON'a çevir (header: 1 ile array of arrays alıyoruz)
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    if (jsonData.length === 0) {
                        reject(new Error('Dosya boş görünüyor.'));
                        return;
                    }

                    // Otomatik sütun algılama
                    const names = detectNameColumn(jsonData);

                    if (names.length === 0) {
                        reject(new Error('Uygun isim listesi bulunamadı.'));
                        return;
                    }

                    resolve(names);
                } catch (err) {
                    reject(err);
                }
            };

            reader.onerror = (err) => reject(err);
            reader.readAsArrayBuffer(file);
        });
    };

    // En mantıklı isim sütununu bulma algoritması
    const detectNameColumn = (rows) => {
        if (!rows || rows.length === 0) return [];

        let bestColIndex = -1;
        let maxNameCount = 0;

        // İlk 10 satırı analiz et (başlıklar vs. olabilir diye)
        // Sütun sayısını bul (en uzun satırdan)
        const numCols = rows.reduce((max, row) => Math.max(max, row.length), 0);
        const scoreMap = new Array(numCols).fill(0);

        // Tüm hücreleri analiz et
        rows.forEach(row => {
            row.forEach((cell, colIndex) => {
                if (typeof cell === 'string' && cell.trim().length > 2) {
                    // Sadece sayı içermiyorsa (öğrenci no değilse)
                    if (!/^\d+$/.test(cell.trim())) {
                        scoreMap[colIndex]++;
                    }
                }
            });
        });

        // En çok "isim benzeri" veri içeren sütunu bul
        bestColIndex = scoreMap.indexOf(Math.max(...scoreMap));

        if (bestColIndex === -1) return [];

        // O sütundaki verileri topla
        const names = [];
        rows.forEach(row => {
            const cell = row[bestColIndex];
            // Başlık gibi görünenleri ele (basit bir mantık: genelde başlıklar kısa ve büyük harfli olabilir veya "Adı" "Soyadı" gibi kelimeler içerir)
            // Ama şimdilik sadece string kontrolü yapalım
            if (typeof cell === 'string' && cell.trim().length > 1) {
                // Yaygın başlıkları eleyebiliriz
                const lower = cell.toLowerCase();
                if (lower !== 'adı' && lower !== 'soyadı' && lower !== 'ad soyad' && lower !== 'isim' && lower !== 'öğrenci') {
                    names.push(cell.trim());
                }
            }
        });

        return names;
    };

    const handleImport = () => {
        if (!className.trim()) {
            setError('Lütfen bir sınıf adı girin.');
            return;
        }
        if (previewData.length === 0) {
            setError('İçe aktarılacak öğrenci bulunamadı.');
            return;
        }

        onImport(className, previewData);
        onClose();
        // Reset states
        setFile(null);
        setClassName('');
        setPreviewData([]);
        setError('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-800 rounded-2xl w-full max-w-md shadow-xl border border-slate-700/50 flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="p-6 border-b border-slate-700/50 flex justify-between items-center flex-none">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        Excel'den İçe Aktar
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 min-h-0">

                    {/* File Input */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${file
                            ? 'border-emerald-500/50 bg-emerald-500/5'
                            : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/30'
                            }`}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".xlsx, .xls"
                            className="hidden"
                        />

                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${file ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                                }`}>
                                {file ? '📊' : '📁'}
                            </div>
                            <div>
                                <p className="font-medium text-white text-sm">
                                    {file ? file.name : 'Excel Dosyası Seçin'}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {file ? `${previewData.length} öğrenci` : 'veya sürükleyip bırakın'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-2">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Class Name Input */}
                    {file && (
                        <div className="mt-5 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Sınıf Adı</label>
                                <input
                                    type="text"
                                    value={className}
                                    onChange={(e) => setClassName(e.target.value)}
                                    placeholder="Örn: 6D"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium text-sm"
                                />
                            </div>

                            {/* Preview List */}
                            {previewData.length > 0 && (
                                <div className="flex flex-col flex-1 min-h-0">
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                        Öğrenci Listesi ({previewData.length})
                                    </label>
                                    <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden overflow-y-auto custom-scrollbar max-h-40">
                                        {previewData.map((name, index) => (
                                            <div k={index} className="px-3 py-2 border-b border-slate-700/50 last:border-0 text-sm text-slate-300 flex items-center gap-2">
                                                <span className="text-slate-600 font-mono text-xs w-5">{index + 1}.</span>
                                                <span className="truncate">{name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-700/50 flex gap-3 flex-none bg-slate-800 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 px-4 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 font-medium transition-all text-sm"
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={!file || !className.trim() || previewData.length === 0 || isLoading}
                        className={`flex-1 py-2.5 px-4 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all text-sm ${!file || !className.trim() || previewData.length === 0 || isLoading
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed shadow-none'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-emerald-500/40 active:scale-95'
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>İşleniyor...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span>İçe Aktar</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
