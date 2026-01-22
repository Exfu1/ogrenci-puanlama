import { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { useAppData } from './hooks/useAppData';
import { getScoreColor } from './utils/constants';
import LoginPage from './components/LoginPage';
import ClassList from './components/ClassList';
import StudentList from './components/StudentList';
import StudentDetail from './components/StudentDetail';
import Settings from './components/Settings';
import AddClassModal from './components/AddClassModal';
import AddStudentModal from './components/AddStudentModal';
import BottomNavbar from './components/BottomNavbar';

function AppContent() {
  const { isAuthenticated, isLoading: authLoading, logout, getDisplayName } = useAuth();
  const {
    classes,
    criteria,
    isLoaded,
    addClass,
    deleteClass,
    getClass,
    reorderClasses,
    addStudent,
    deleteStudent,
    getStudent,
    updateScore,
    reorderStudents,
    addCriteria,
    deleteCriteria,
    updateCriteria,
    resetCriteria,
    getMaxTotal
  } = useAppData();

  const [currentPage, setCurrentPage] = useState('classes');
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  // Auth yükleniyor
  if (authLoading) {
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

  // Giriş yapmamış
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Veri yükleniyor
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse">
            <span className="text-3xl">📚</span>
          </div>
          <p className="text-slate-400">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  const totalStudents = classes.reduce((sum, c) => sum + (c.students?.length || 0), 0);

  const handleSelectClass = (classId) => {
    setSelectedClassId(classId);
    setCurrentPage('students');
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudentId(studentId);
    setCurrentPage('detail');
  };

  const handleBack = () => {
    if (currentPage === 'detail') {
      setCurrentPage('students');
      setSelectedStudentId(null);
    } else if (currentPage === 'students') {
      setCurrentPage('classes');
      setSelectedClassId(null);
    } else {
      setCurrentPage('classes');
    }
  };

  const handleNavigate = (page) => {
    if (page === 'home') {
      setCurrentPage('classes');
      setSelectedClassId(null);
      setSelectedStudentId(null);
    } else {
      setCurrentPage(page);
    }
  };

  const handleAddClass = (name) => {
    addClass(name);
  };

  const handleAddStudent = (name) => {
    if (selectedClassId) {
      addStudent(selectedClassId, name);
    }
  };

  const selectedClass = selectedClassId ? getClass(selectedClassId) : null;
  const selectedStudent = selectedClassId && selectedStudentId
    ? getStudent(selectedClassId, selectedStudentId)
    : null;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Sayfalar */}
      {currentPage === 'classes' && (
        <ClassList
          classes={classes}
          onSelectClass={handleSelectClass}
          onDeleteClass={deleteClass}
          onReorderClasses={reorderClasses}
          displayName={getDisplayName()}
          onLogout={logout}
        />
      )}

      {currentPage === 'students' && selectedClass && (
        <StudentList
          classObj={selectedClass}
          criteria={criteria}
          onBack={handleBack}
          onSelectStudent={handleSelectStudent}
          onDeleteStudent={(studentId) => deleteStudent(selectedClassId, studentId)}
          onReorderStudents={(startIndex, endIndex) => reorderStudents(selectedClassId, startIndex, endIndex)}
        />
      )}

      {currentPage === 'detail' && selectedStudent && (
        <StudentDetail
          student={selectedStudent}
          criteria={criteria}
          maxTotal={getMaxTotal()}
          onBack={handleBack}
          onUpdateScore={(criteriaId, value) =>
            updateScore(selectedClassId, selectedStudentId, criteriaId, value)
          }
        />
      )}

      {currentPage === 'settings' && (
        <Settings
          onBack={() => setCurrentPage('classes')}
          criteria={criteria}
          onAddCriteria={addCriteria}
          onUpdateCriteria={updateCriteria}
          onDeleteCriteria={deleteCriteria}
          onResetCriteria={resetCriteria}
          classCount={classes.length}
          studentCount={totalStudents}
        />
      )}

      {/* Alt Navigasyon */}
      {currentPage !== 'detail' && currentPage !== 'students' && (
        <BottomNavbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onAddStudent={() => setIsClassModalOpen(true)}
        />
      )}

      {/* Öğrenci sayfasında özel navbar */}
      {currentPage === 'students' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 safe-bottom z-50">
          <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-4">
            <button
              onClick={handleBack}
              className="flex flex-col items-center gap-1 py-2 px-6 rounded-xl text-slate-400 hover:text-white transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-xs font-medium">Geri</span>
            </button>

            <button
              onClick={() => setIsStudentModalOpen(true)}
              className="flex flex-col items-center gap-1 -mt-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 active:scale-95 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-xs font-medium text-slate-400">Öğrenci Ekle</span>
            </button>

            <button
              onClick={() => handleNavigate('settings')}
              className="flex flex-col items-center gap-1 py-2 px-6 rounded-xl text-slate-400 hover:text-white transition-all"
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
      )}

      {/* Modallar */}
      <AddClassModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        onAdd={handleAddClass}
      />

      <AddStudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onAdd={handleAddStudent}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
