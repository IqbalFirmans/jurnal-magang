import DashboardPage from '../pages/DashboardPage';
import JournalsPage from '../pages/JournalPage';
import StudentsPage from '../pages/StudentPage';
import TeachersPage from '../pages/admin/TeacherPage';

const appRoutes = [
  {
    path: '/',
    element: <DashboardPage />,
    roles: ['admin', 'teacher', 'student'],
  },
  {
    path: '/teachers',
    element: <TeachersPage />,
    roles: ['admin'],
  },
  {
    path: '/students',
    element: <StudentsPage />,
    roles: ['admin', 'teacher'],
  },
  {
    path: '/journals',
    element: <JournalsPage />,
    roles: ['admin', 'teacher', 'student'],
  },
];

export default appRoutes;
