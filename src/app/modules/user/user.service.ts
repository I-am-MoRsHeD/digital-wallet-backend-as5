import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from 'bcryptjs';


const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
        throw new AppError(400, 'User already exists');
    };

    const bcryptedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUNDS));

    const user = await User.create({
        email,
        password: bcryptedPassword,
        ...rest,
    });
    return user;
};

const getAllUser = async () => {
    const users = await User.find();
    return users;
};

const singleUser = async (id: string) => {
    const user = await User.findById(id);
    return user;
};


export const UserServices = {
    createUser,
    getAllUser,
    singleUser
};