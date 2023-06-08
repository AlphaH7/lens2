import client from './AppHelper';

const apiHelper = {
  getUsers: async () => {
    const response = await client.get('/api/users');
    return response;
  },
};

export default apiHelper;
