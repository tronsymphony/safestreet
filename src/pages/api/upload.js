import nextConnect from 'next-connect';
import upload from '../../components/upload';

const apiRoute = nextConnect({
    onError(error, req, res) {
      res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
    },
    onNoMatch(req, res) {
      res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
  });

  apiRoute.use(upload.single('image'));


  apiRoute.post((req, res) => {
    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
  });

  export default apiRoute;


  export const config = {
    api: {
      bodyParser: false,
    },
  };