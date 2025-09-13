import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IPassword, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from 'bcryptjs';
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constant";
import { Active, isApproved } from "../../interface/globalTypes";


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

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
    return newUpdatedUser;
};

const changePassword = async (userId: string, payload: IPassword, decodedUser: JwtPayload) => {
    const isUserExist = await User.findById(userId);

    if (!isUserExist) {
        throw new AppError(404, 'User not found');
    };

    if (decodedUser.userId !== userId) {
        throw new AppError(403, 'You are not permitted to change this password!');
    };

    if (payload.currentPassword) {
        const bcryptedPassword = await bcrypt.compare(payload.currentPassword as string, isUserExist.password as string);

        if (!bcryptedPassword) {
            throw new AppError(400, "Password is incorrect");
        };
        payload.newPassword = await bcrypt.hash(payload.newPassword as string, Number(envVars.BCRYPT_SALT_ROUNDS));
    };

    const updatedPassword = {
        password: payload.newPassword
    }

    await User.findByIdAndUpdate(userId, updatedPassword, { new: true, runValidators: true });
    return;
};

const blockUnblockUser = async (id: string) => {
    const user = await User.findById(id);

    if (!user) {
        throw new AppError(404, 'User not found');
    };
    if (user.role !== Role.USER) {
        throw new AppError(400, 'Only regular users can be blocked');
    };

    if (user.isActive === Active.BLOCKED) {
        user.isActive = Active.ACTIVE;
    } else {
        user.isActive = Active.BLOCKED;
    }

    await user.save();

    return user;
};

const approveOrSuspendAgent = async (id: string) => {
    const agent = await User.findById(id);

    if (!agent) {
        throw new AppError(404, 'User not found');
    };
    if (agent.role !== Role.AGENT) {
        throw new AppError(400, 'Only regular agents can be suspended');
    };

    if (agent.isApproved === isApproved.PENDING) {
        agent.isApproved = isApproved.APPROVED;
    } else if (agent.isApproved === isApproved.SUSPENDED) {
        agent.isApproved = isApproved.APPROVED;
    } else {
        agent.isApproved = isApproved.SUSPENDED;
    }

    await agent.save();

    return agent;
};

export const UserServices = {
    createUser,
    getAllUser,
    getMe,
    singleUser,
    updateUser,
    changePassword,
    blockUnblockUser,
    approveOrSuspendAgent
};