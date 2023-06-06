import axios from 'axios';

export const login = async (FormData) => {
  try {
    const response = await axios.post('http://localhost:3000/student/stud', { 
      FormData
    },{ withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
