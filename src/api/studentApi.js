import apiClient from './axios';

const studentApi = {
  getStudents: async () => {
    try {
      const response = await apiClient.get('/api/administrator/monitored/get/student/all');
      const data = response.data?.students;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching Students:', error.response?.data || error.message);
      throw error;
    }
  },

  getTeacherStudents: async () => {
    try {
      const response = await apiClient.get('/api/teacher/monitored/get/students');
      const data = response.data?.students  ;
      console.log('student API response:', response.data);
      
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching Students:', error.response?.data || error.message);
      throw error;
    }
  },

  storeStudent: async (formData) => {
    try {
      const response = await apiClient.post('/api/administrator/student/store', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error storing student:', error.response?.data || error.message);
      throw error;
    }
  },


  updateStudent: async (id, formData) => {
    try {

      formData.append('_method', 'PUT');
      const response = await apiClient.post(`/api/administrator/student/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating student:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  deleteStudent: async (id) => {
    try {
      const response = await apiClient.delete(`/api/administrator/student/destroy/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting student:', error.response ? error.response.data : error.message);
      throw error;
    }
  },
};

export default studentApi;