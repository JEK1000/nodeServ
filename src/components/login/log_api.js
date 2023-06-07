import axios from 'axios';

export const login = async (FormData) => {
  try {
    const response = await axios.post('http://nodeserv-production.up.railway.app/stud', { 
      FormData
    },{ withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
