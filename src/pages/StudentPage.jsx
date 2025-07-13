import React from 'react';
import { useAuthStore } from '../store/authStore';
import AdminStudentView from './admin/AdminStudentView';
import TeacherStudentView from './teacher/TeacherStudentView';


const StudentsPage = () => {
  const user = useAuthStore((state) => state.user);

  if (user?.role === 'admin') {
    return <AdminStudentView />;
  } else if (user?.role === 'teacher') {
    return <TeacherStudentView />;
  } else {
    return <div>Akses ditolak</div>;
  }
};


export default StudentsPage;
