import axios from 'axios';

export default async function handler(res: any) {
  try {
    const users = await axios({
      url: process.env.MOCKY_EP,
      method: 'get',
    });
    // console.log(users.data);
    return res.status(200).json(users.data);
  } catch (error: any) {
    // console.log(error.response.data);
    return res.status(error.response.status).json(error.response.data);
  }
}
