import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from 'bcryptjs';
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constant";
import { isApproved } from "../../interface/globalTypes";


const createUser = async (payload: Partial<IUser>) => {
    const { email, password, role, isApproved, ...rest } = payload;

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
        throw new AppError(400, 'User already exists');
    };

    const bcryptedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUNDS));

    const userPayload = {
        email,
        password: bcryptedPassword,
        role,
        isApproved,
        ...rest,
    }

    if (role === Role.USER) {
        userPayload.isApproved = 'APPROVED' as isApproved
    };


    const user = await User.create(userPayload);
    return user;
};

const getAllUser = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(User.find(), query);
    const users = await queryBuilder
        .filter()
        .search(userSearchableFields)
        .sort()
        .paginate()

    const [data, meta] = await Promise.all([
        users.build(),
        queryBuilder.getMeta()
    ]);

    return {
        data,
        meta
    };
};
const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    return user
};
const singleUser = async (id: string) => {
    const user = await User.findById(id);
    return user;
};

const updateUser = async (userId: string, payload: Partial<IUser>, decodedUser: JwtPayload) => {
    const isUserExist = await User.findById(userId);

    if (!isUserExist) {
        throw new AppError(404, 'User not found');
    };

    if (payload.email) {
        throw new AppError(400, 'You cannot update your email!');
    };
    if (payload.role) {
        if (decodedUser.role === Role.USER || decodedUser.role === Role.AGENT) {
            throw new AppError(403, 'You are not permitted to do this!');
        };
    };

    if (payload.isActive || payload.isDeleted) {
        if (decodedUser.role === Role.USER || decodedUser.role === Role.AGENT) {
            throw new AppError(403, 'You are not permitted to do this!');
        };
    };

    if (payload.password) {
        payload.password = await bcrypt.hash(payload.password as string, envVars.BCRYPT_SALT_ROUNDS);
    };

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
    return newUpdatedUser;
}

export const UserServices = {
    createUser,
    getAllUser,
    getMe,
    singleUser,
    updateUser
};