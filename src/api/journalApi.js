import apiClient from './axios';

const journalApi = {
  getJournals: async () => {
    try {
      const response = await apiClient.get('/api/student/journal/get/data');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching journals:', error.response?.data || error.message);
      throw error;
    }
  },

  storeJournal: async (formData) => {
  try {
    const response = await apiClient.post('/api/student/journal/store', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error storing journal:', error.response?.data || error.message);
    throw error;
  }
},


  updateJournal: async (id, formData) => {
    try {
      formData.append('_method', 'PUT'); 
      const response = await apiClient.post(`/api/student/journal/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating journal:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  deleteJournal: async (id) => {
    try {
      const response = await apiClient.delete(`/api/student/journal/destroy/${id}`);
      return response.data; 
    } catch (error) {
      console.error('Error deleting journal:', error.response ? error.response.data : error.message);
      throw error;
    }
  },
};

export default journalApi;