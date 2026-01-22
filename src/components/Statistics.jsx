import { useMemo } from 'react';
import { getScoreColor } from '../utils/constants';

export default function Statistics({ classes, criteria }) {
    // Sınıf ortalamalarını hesapla
    const classStats = useMemo(() => {
        return classes.map(c => {
            const students = c.students || [];
            if (students.length === 0) {
                return { id: c.id, name: c.name, average: 0, studentCount: 0 };
            }
            const total = students.reduce((sum, s) => sum + s.total, 0);
            const average = Math.round(total / students.length);
            return { id: c.id, name: c.name, average, studentCount: students.length };
        }).filter(c => c.studentCount > 0);
    }, [classes]);

    // Tüm öğrencilerin kriter bazlı ortalamalarını hesapla
    const criteriaStats = useMemo(() => {
        const allStudents = classes.flatMap(c => c.students || []);
        if (allStudents.length === 0) return [];

        return criteria.map(crit => {
            const totalScore = allStudents.reduce((sum, s) => sum + (s.scores?.[crit.id] || 0), 0);
            const average = Math.round((totalScore / allStudents.length) * 10) / 10;
            const percentage = Math.round((average / crit.maxScore) * 100);
            return {
                id: crit.id,
                name: crit.name,
                icon: crit.icon,
                maxScore: crit.maxScore,
                average,
                percentage
            };
        });
    }, [classes, criteria]);

    // Genel ortalama
    const overallAverage = useMemo(() => {
        const allStudents = classes.flatMap(c => c.students || []);
        if (allStudents.length === 0) return 0;
        const total = allStudents.reduce((sum, s) => sum + s.total, 0);
        return Math.round(total / allStudents.length);
    }, [classes]);

    const maxTotal = criteria.reduce((sum, c) => sum + c.maxScore, 0);
    const overallPercentage = maxTotal > 0 ? Math.round((overallAverage / maxTotal) * 100) : 0;

    if (classStats.length === 0) {
        return (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                    <span>📈</span> Detaylı İstatistikler
                </h3>
                <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-700/50 flex items-center justify-center">
                        <span className="text-3xl">📊</span>
                    </div>
                    <p className="text-slate-400 text-sm">
                        İstatistikleri görmek için en az bir sınıfa öğrenci ekleyin
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Genel Ortalama */}
            <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-4 border border-indigo-500/30">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-white font-medium flex items-center gap-2">
                            <span>🎯</span> Genel Ortalama
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">Tüm öğrencilerin ortalaması</p>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-white">{overallAverage}</p>
                        <p className="text-indigo-300 text-sm">/ {maxTotal} puan</p>
                    </div>
                </div>
                <div className="mt-3 h-3 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${overallPercentage}%` }}
                    />
                </div>
                <p className="text-right text-sm text-slate-400 mt-1">%{overallPercentage}</p>
            </div>

            {/* Sınıf Ortalamaları */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                    <span>📊</span> Sınıf Ortalamaları
                </h3>
                <div className="space-y-3">
                    {classStats.map((c, index) => {
                        const percentage = Math.round((c.average / maxTotal) * 100);
                        const scoreColor = getScoreColor(c.average);

                        return (
                            <div key={c.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">📁</span>
                                        <span className="text-white text-sm font-medium truncate max-w-[150px]">
                                            {c.name}
                                        </span>
                                        <span className="text-slate-500 text-xs">
                                            ({c.studentCount} öğrenci)
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`font-bold ${scoreColor.text}`}>
                                            {c.average}
                                        </span>
                                        <span className="text-slate-500 text-xs">
                                            %{percentage}
                                        </span>
                                    </div>
                                </div>
                                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-gradient-to-r ${scoreColor.gradient} rounded-full transition-all duration-500`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Kriter Dağılımı */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                    <span>📉</span> Kriter Bazlı Performans
                </h3>
                <div className="space-y-3">
                    {criteriaStats.map((crit, index) => {
                        const color = crit.percentage >= 70 ? 'from-green-500 to-emerald-500' :
                            crit.percentage >= 50 ? 'from-blue-500 to-indigo-500' :
                                crit.percentage >= 30 ? 'from-orange-500 to-amber-500' :
                                    'from-red-500 to-rose-500';

                        return (
                            <div key={crit.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{crit.icon}</span>
                                        <span className="text-white text-sm">{crit.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-medium">
                                            {crit.average}
                                        </span>
                                        <span className="text-slate-500 text-xs">
                                            / {crit.maxScore}
                                        </span>
                                    </div>
                                </div>
                                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500`}
                                        style={{ width: `${crit.percentage}%` }}
                                    />
                                </div>
                                <p className="text-right text-xs text-slate-500 mt-0.5">%{crit.percentage}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
