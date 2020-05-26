import axios from 'axios';
import applyConverters from 'axios-case-converter';

const token = localStorage.getItem('access_token');

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
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
);