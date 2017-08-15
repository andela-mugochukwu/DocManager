import http from 'http';
import app from './server/app';

const port = parseInt(process.env.PORT, 10) || 1844;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
