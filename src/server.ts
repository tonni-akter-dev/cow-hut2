import { connect } from 'mongoose';
import { config } from './config';
import { Server } from 'http';
import app from './app';

let server: Server;

//  handle uncaught exceptions and shutdown the server gracefully
process.on('uncaughtException', err => {
  console.log(err);
  console.log('Shutting down the server due to Uncaught Exception');
  process.exit(1);
});

async function run_server() {
  try {
    // connect database
    await connect(config.db_uri as string);
    server = app.listen(config.port, () => {
      console.log(`Server is successfully running on port ${config.port}`);
    });

    // handle unhandled promise rejections
    process.on('unhandledRejection', err => {
      console.log(err);
      console.log(
        'Shutting down the server due to Unhandled Promise rejection'
      );
      if (server) {
        server.close(() => {
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

// handle SIGTERM signal for shutdown the server
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  if (server) {
    server.close(() => {
      console.log('Process terminated');
    });
  }
});

run_server();
