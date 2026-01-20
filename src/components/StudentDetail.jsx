import ScoreInput from './ScoreInput';
import { SCORE_CRITERIA, getScoreColor, MAX_TOTAL_SCORE } from '../utils/constants';

export default function StudentDetail({ student, onBack, onUpdateScore }) {
    if (!student) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <p className="text-slate-400">Öğrenci bulunamadı</p>
            </div>
        );
    }

    const scoreColor = getScoreColor(student.total);
    const percentage = Math.round((student.total / MAX_TOTAL_SCORE) * 100);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 pb-28">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50">
                <div className="max-w-lg mx-auto px-4 py-4">
                    {/* Geri butonu ve başlık */}
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={onBack}
                            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl font-bold text-white truncate">
                                {student.name}
                            </h1>
                            <p className="text-slate-400 text-sm">Puanları düzenle</p>
                        </div>
                    </div>

                    {/* Toplam Puan Kartı */}
                    <div className={`
            bg-gradient-to-br ${scoreColor.gradient} 
            rounded-2xl p-6 shadow-lg animate-scale-in
          `}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-sm font-medium">Toplam Puan</p>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-5xl font-bold text-white">
                                        {student.total}
                                    </span>
                                    <span className="text-white/70 text-lg">/ {MAX_TOTAL_SCORE}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold text-white">%{percentage}</span>
                                    <span className="text-white/70 text-xs">başarı</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-4">
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Puanlama Kriterleri */}
            <div className="max-w-lg mx-auto px-4 py-6">
                <h2 className="text-lg font-semibold text-white mb-4">Puanlama Kriterleri</h2>

                <div className="space-y-4">
                    {SCORE_CRITERIA.map((criteria, index) => (
                        <div
                            key={criteria.id}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <ScoreInput
                                criteria={criteria}
                                score={student.scores[criteria.id] || 0}
                                maxScore={criteria.maxScore}
                                onChange={(value) => onUpdateScore(student.id, criteria.id, value)}
                            />
                        </div>
                    ))}
                </div>

                {/* Özet */}
                <div className="mt-8 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                    <h3 className="text-white font-medium mb-3">Puan Özeti</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {SCORE_CRITERIA.map(criteria => {
                            const score = student.scores[criteria.id] || 0;
                            const percent = Math.round((score / criteria.maxScore) * 100);
                            return (
                                <div key={criteria.id} className="flex items-center gap-2 text-sm">
                                    <span>{criteria.icon}</span>
                                    <span className="text-slate-400 flex-1 truncate">{criteria.name}</span>
                                    <span className="text-white font-medium">{score}/{criteria.maxScore}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
