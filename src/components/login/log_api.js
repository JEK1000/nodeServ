import axios from 'axios';

export const login = async (FormData) => {
  try {
    const response = await axios.post('mysql://root:akHj6zhIEvRMgFWxcPKi@containers-us-west-131.railway.app:7068/railway/student/stud', { 
      FormData
    },{ withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
