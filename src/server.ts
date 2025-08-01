/* eslint-disable no-console */
import mongoose from 'mongoose';
import app from './app';
import { Server } from 'http';
import { envVars } from './app/config/env';

let server: Server;

const startServer = async () => {
    try {
        await mongoose.connect(envVars.MONGO_URL as string);
        console.log('Connected to DB...!!');
        server = app.listen(envVars.PORT, () => {
            console.log('Server is running on port 3000!!');
        });
    } catch (error) {
        console.log(error);
    };
};

startServer();

process.on('unhandledRejection', (err) => {
    console.log("Unhandled rejection is detected...Server is shutting down...!", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        })
    };
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.log("Uncaught expection is detected...Server is shutting down...!", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        })
    };
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log("SIGTERN signal is received...Server is shutting down...!");
    if (server) {
        server.close(() => {
            process.exit(1);
        })
    };
    process.exit(1);
});