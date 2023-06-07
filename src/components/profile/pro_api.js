import axios from 'axios';

export const profile = async (FormData, id) => {
  try {
    const response = await axios.put(`https://nodeserv-production.up.railway.app/api/update_user/${id}`, { 
      FormData
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
