import Axios from 'axios';
import { toastOnError } from '../stores/toastMessageStore';

const baseURL = import.meta.env.VITE_BASE_URL || '/api';

export const axios = Axios.create({ baseURL });

// Simulate network latency for the mock API to make loading states visible
axios.interceptors.request.use(
  (config) => new Promise((resolve) => setTimeout(() => resolve(config), 300))
);

export const onError = toastOnError;
