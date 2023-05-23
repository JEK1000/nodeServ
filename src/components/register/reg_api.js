import axios from 'axios';

export const register = async (FormData) => {
  try {
    const response = await axios.post('http://localhost:3000/student_registration/api/register', { 
      FormData
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
