import { Server } from 'http';
import app from './app.js';
import { envVars } from './config/env';
import { seedSuperAdmin } from './app/utils/seed.js';

let server: Server;
const PORT = envVars.PORT;

const bootsrap = async () => {
  try {
    await seedSuperAdmin();
    server = app.listen(PORT, () => {
      console.log(`The server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log('Failed to start server', error);
  }
};

bootsrap();
