import dotenv from 'dotenv';

dotenv.config();

interface EnvVars {
    PORT: string;
    MONGO_URL: string;
    BCRYPT_SALT_ROUNDS: string;
    NODE_ENV: string;
    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_EXPIRES: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES: string;
};

const requiredEnvVariables: string[] = ['PORT', 'MONGO_URL', 'BCRYPT_SALT_ROUNDS', 'NODE_ENV', 'JWT_ACCESS_SECRET', 'JWT_ACCESS_EXPIRES', 'JWT_REFRESH_SECRET', 'JWT_REFRESH_EXPIRES'];

const loadEnvVariables = (): EnvVars => {
    requiredEnvVariables.forEach((envVar) => {
        if (!process.env[envVar]) {
            throw new Error(`Missing environment variable: ${envVar}`);
        };
    });

    return {
        PORT: process.env.PORT as string,
        MONGO_URL: process.env.MONGO_URL as string,
        BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS as string,
        NODE_ENV: process.env.NODE_ENV as string,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string
    };
};

export const envVars = loadEnvVariables();