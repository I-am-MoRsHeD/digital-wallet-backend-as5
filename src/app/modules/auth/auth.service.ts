import AppError from "../../errorHelpers/AppError";
import { createUserTokens } from "../../utils/userTokens";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from 'bcryptjs';


const credentialsLogin = async (payload: Partial<IUser>) => {

    const { email, password } = payload;

    const isUserExist = await User.findOne({ email });
    if (!isUserExist) {
        throw new AppError(400, 'Email does not exist');
    };

    const bcryptedPassword = await bcrypt.compare(password as string, isUserExist.password as string);

    if (!bcryptedPassword) {
        throw new AppError(400, "Password is incorrect");
    };

    const userTokens = createUserTokens(isUserExist);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password : pass, ...rest } = isUserExist.toObject();

    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    };
};

export const AuthServices = {
    credentialsLogin
};