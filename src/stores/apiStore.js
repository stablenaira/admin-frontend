import { create } from 'zustand';

import axios from 'axios';

// Set axios defaults for baseURL and x-api-key header
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers.common['x-api-key'] = import.meta.env.VITE_APP_KEY;

const useApiStore = create((set) => ({
  data: null,
  loading: false,
  error: null,
  async fetchData(endpoint) {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(endpoint);
      console.log(response)
      set({ data: response.data.data, loading: false });
      return response
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  async postData(endpoint, payload) {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(endpoint, payload);
      set({ data: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  async putData(endpoint, payload) {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(endpoint, payload);
      set({ data: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  async deleteData(endpoint) {
    set({ loading: true, error: null });
    try {
      const response = await axios.delete(endpoint);
      set({ data: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useApiStore;
