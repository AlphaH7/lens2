import axios from 'axios';

type IRequest = {
  body: any;
  url: string;
};

export default async function handler(req: IRequest, res: any) {
  try {
    const users = await axios({
      url: process.env.MOCKY_EP,
      method: 'get',
      data: req.body,
    });
    console.log(users.data);
    return res.status(200).json(users.data);
  } catch (error: any) {
    console.log(error.response.data);
    return res.status(error.response.status).json(error.response.data);
  }
}
