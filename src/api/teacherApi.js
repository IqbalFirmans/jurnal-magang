import apiClient from './axios';

const teacherApi = {
  getTeachers: async () => {
  try {
    const response = await apiClient.get('/api/administrator/monitored/get/teachers');
    const data = response.data?.teachers;
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching Teachers:', error.response?.data || error.message);
    throw error;
  }
},

  storeTeacher: async (formData) => {
    try {
      const response = await apiClient.post('/api/administrator/teacher/store', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error storing teacher:', error.response?.data || error.message);
      throw error;
    }
  },


  updateTeacher: async (id, formData) => {
    try {

      formData.append('_method', 'PUT');
      const response = await apiClient.post(`/api/administrator/teacher/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating teacher:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  deleteTeacher: async (id) => {
    try {
      const response = await apiClient.delete(`/api/administrator/teacher/destroy/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting teacher:', error.response ? error.response.data : error.message);
      throw error;
    }
  },
};

export default teacherApi;