/* eslint-disable no-console */
import { envVars } from "../config/env"
import { IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from 'bcryptjs';


export const seedAdmin = async () => {
    try {
        const isAdminExist = await User.findOne({ email: envVars.DEFAULT_ADMIN_EMAIL });

        if (isAdminExist) {
            console.log('Admin already exists!');
            return;
        };

        const bcryptedPassword = await bcrypt.hash(envVars.DEFAULT_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUNDS));

        const payload: IUser = {
            name: "Don banega Admin!",
            email: envVars.DEFAULT_ADMIN_EMAIL,
            password: bcryptedPassword,
            role: Role.ADMIN,
        }
        const admin = await User.create(payload);
        console.log(admin);
    } catch (error) {
        console.log(error);
    }
}