const axios = require('axios');

// const domaine = process.env.REACT_APP_API_DOMAINE;
const domaine = "http://localhost:4000";
const apiAxios = axios.create({
    baseURL: `${domaine}`,
    timeout: 1000,
});

export {apiAxios}; 