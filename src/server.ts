import { Server } from 'http';
import app from './app';
import { envVars } from './config/env';

let server: Server;
const PORT = envVars.PORT;

const bootsrap = async () => {
  try {
    server = app.listen(PORT, () => {
      console.log(`The server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log('Failed to start server', error);
  }
};

bootsrap();
