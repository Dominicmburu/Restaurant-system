// src/utils/api.js
import axios from 'axios';

const API_BASE_URL = 'https://your-backend-api.com';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const fetchData = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
};
