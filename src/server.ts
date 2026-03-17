import { Server } from 'http';
import app from './app';

let server: Server;

const bootsrap = async () => {
  try {
    server = app.listen(5000, () => {
      console.log('The server is running on http://localhost:5000');
    });
  } catch (error) {
    console.log('Failed to start server', error);
  }
};

bootsrap();
