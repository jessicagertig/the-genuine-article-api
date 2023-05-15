require('dotenv').config();

const server = require('../app');
const debug = require('debug')('the-genuine-article-api:server');

const port = process.env.PORT || 4000;
server.set('port', port);

server.listen(port, () => {
  console.log(`Server is listening now on port ${port}`);
});

server.on('error', onError);
server.on('listening', onListening);

// event listener for Express server "error" event
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  } else {
    const bind =
      typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
}

// event listener for Express server "listening" event
function onListening() {
  const addr = server.address();
  const bind =
    typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
