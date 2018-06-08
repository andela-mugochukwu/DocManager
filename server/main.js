import http from 'http';
import dotenv from 'dotenv';

import app from './app';

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 1844;
app.set('port', port);

const server = http.createServer(app);
if (process.env.NODE_ENV === 'development') {
  console.log('running on port', port, 'in', process.env.NODE_ENV);
}

server.listen(port);
