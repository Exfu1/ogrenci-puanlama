import { useState } from 'react';
import StudentCard from './StudentCard';
import SearchBar from './SearchBar';

export default function StudentList({ students, onSelectStudent, onDeleteStudent }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredStudents = searchQuery.trim()
        ? students.filter(s =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : students;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 pb-28">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 px-4 pt-6 pb-4">
                <div className="max-w-lg mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Öğrenciler</h1>
                            <p className="text-slate-400 text-sm mt-1">
                                {students.length} öğrenci kayıtlı
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <span className="text-2xl">📚</span>
                        </div>
                    </div>

                    <SearchBar onSearch={setSearchQuery} />
                </div>
            </div>

            {/* Öğrenci Listesi */}
            <div className="max-w-lg mx-auto px-4 py-4">
                {students.length === 0 ? (
                    <div className="text-center py-16 animate-fade-in">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-slate-800 flex items-center justify-center">
                            <span className="text-5xl">👨‍🎓</span>
                        </div>
                        <h3 className="text-white text-lg font-semibold mb-2">
                            Henüz öğrenci yok
                        </h3>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto">
                            Alt menüdeki + butonuna tıklayarak ilk öğrencinizi ekleyin
                        </p>
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="text-center py-16 animate-fade-in">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-800 flex items-center justify-center">
                            <span className="text-4xl">🔍</span>
                        </div>
                        <h3 className="text-white font-semibold mb-1">
                            Sonuç bulunamadı
                        </h3>
                        <p className="text-slate-400 text-sm">
                            "{searchQuery}" ile eşleşen öğrenci yok
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredStudents.map((student, index) => (
                            <div
                                key={student.id}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <StudentCard
                                    student={student}
                                    onSelect={onSelectStudent}
                                    onDelete={onDeleteStudent}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
