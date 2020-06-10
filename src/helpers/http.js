import axios from 'axios';
import applyConverters from 'axios-case-converter';

export const httpRequest = applyConverters(
  axios.create({
    baseURL: process.env.VUE_APP_SERVER_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
);

export const httpAuthRequest = applyConverters(
  axios.create({
    baseURL: process.env.VUE_APP_SERVER_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
);

const instances = [
  {
    axios: httpRequest,
    hasInterceptor: false,
    requiredAuth: false
  },
  {
    axios: httpAuthRequest,
    hasInterceptor: false,
    requiredAuth: true
  }
];

instances.forEach((instance) => {
  if (instance.requiredAuth && !instance.hasInterceptor) {
    instance.axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('adminAccessToken');
      config.headers['Authorization'] = `Bearer ${token}`;
      return config;
    }, (error) =>
      Promise.reject(error)
    );
    instance.hasInterceptor = true;
  }
})
