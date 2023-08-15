import dotenv from 'dotenv';
import program from './commander.js';

let path = '.env.dev';

if (program.opts().mode === 'prod') {
	path = '.env.prod';
}

dotenv.config({ path });

export default {
	PORT: process.env.PORT,
	ENVIRONMENT: process.env.ENVIRONMENT,
	MONGO_URL: process.env.MONGO_URL,
	ADMIN_NAME: process.env.ADMIN_NAME,
	ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
	EMAIL: process.env.EMAIL,
	EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
};
