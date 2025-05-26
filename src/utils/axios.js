import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Certifique-se de que a URL está correta
});

export default api;