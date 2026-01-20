import { useState } from 'react';
import { useStudents } from './hooks/useStudents';
import StudentList from './components/StudentList';
import StudentDetail from './components/StudentDetail';
import Settings from './components/Settings';
import AddStudentModal from './components/AddStudentModal';
import BottomNavbar from './components/BottomNavbar';

export default function App() {
  const {
    students,
    isLoaded,
    addStudent,
    deleteStudent,
    updateScore,
    getStudent
  } = useStudents();

  const [currentPage, setCurrentPage] = useState('home'); // home, detail, settings
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectStudent = (id) => {
    setSelectedStudentId(id);
    setCurrentPage('detail');
  };

  const handleBack = () => {
    setCurrentPage('home');
    setSelectedStudentId(null);
  };

  const handleNavigate = (page) => {
    if (page === 'home') {
      handleBack();
    } else {
      setCurrentPage(page);
    }
  };

  const handleAddStudent = (name) => {
    addStudent(name);
  };

  // Yükleme ekranı
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse">
            <span className="text-3xl">📚</span>
          </div>
          <p className="text-slate-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Sayfalar */}
      {currentPage === 'home' && (
        <StudentList
          students={students}
          onSelectStudent={handleSelectStudent}
          onDeleteStudent={deleteStudent}
        />
      )}

      {currentPage === 'detail' && (
        <StudentDetail
          student={getStudent(selectedStudentId)}
          onBack={handleBack}
          onUpdateScore={updateScore}
        />
      )}

      {currentPage === 'settings' && (
        <Settings
          onBack={handleBack}
          studentCount={students.length}
        />
      )}

      {/* Alt Navigasyon (detay sayfasında gizle) */}
      {currentPage !== 'detail' && (
        <BottomNavbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onAddStudent={() => setIsModalOpen(true)}
        />
      )}

      {/* Öğrenci Ekleme Modalı */}
      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddStudent}
      />
    </div>
  );
}
