import client from './AppHelper';

const apiHelper = {
  getUsers: async () => {
    const response = await client.get(
      'http://www.mocky.io/v2/5ba8efb23100007200c2750c'
    ); // disabled middleware at pages/api/users as netlify is not supporting server routes
    return response;
  },
};

export default apiHelper;
