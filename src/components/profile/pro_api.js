import axios from 'axios';

export const profile = async (FormData, id) => {
  try {
    const response = await axios.put(`http://localhost:3000/api/update_user/${id}`, { 
      FormData
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};