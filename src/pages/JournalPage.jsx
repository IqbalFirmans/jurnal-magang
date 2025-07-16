import { useAuthStore } from '../store/authStore';
import AdminJournalView from './admin/AdminJournalView';
import StudentJournalView from './student/StudentJournalView';
import TeacherJournalView from './teacher/TeacherJournalView';


const JournalsPage = () => {
  const user = useAuthStore(state => state.user);

  if (!user) return null;

  switch (user.role) {
    case 'admin':
      return <AdminJournalView />;
    case 'teacher':
      return <TeacherJournalView />;
    case 'student':
      return <StudentJournalView />;
    default:
      return <p className="text-center mt-10">Role tidak dikenali</p>;
  }
};

export default JournalsPage;
