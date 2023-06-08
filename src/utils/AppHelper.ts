import axios from 'axios';

const client = {
  get: (url: string) => axios.get(url),
};

export default client;
