import User from "../Database/Schema/User";
import { PagincationModel } from "../base/paginationModel";
import { Result } from "../base/resultModel";
import { ErrorCode, HttpStatusCode } from "../utility/enum";
import { UserModel } from "./user.model";

export class UserRepository {
  public async loginUser(
    email: string,
    password: string
  ): Promise<Result<boolean>> {
    try {
      // Check if the user with the specified ID exists
      // Delete the user from the database
      const user = await User.findOne({ email, password });
      return new Result({
        code: user ? HttpStatusCode.Ok : HttpStatusCode.Unauthorized,
        key: user ? ErrorCode.Ok : ErrorCode.Unauthorized,
        result: !!user,
      });
    } catch (error: any) {
      return new Result({
        code: HttpStatusCode.InternalServerError,
        key: ErrorCode.InternalServerError,
        error: error,
      });
    }
  }

  public async getUsers(
    pageSize: number,
    pageIndex: number,
    keyword?: string
  ): Promise<Result<PagincationModel<UserModel>>> {
    const query = keyword
      ? {
          $or: [
            { firstName: { $regex: keyword, $options: "i" } },
            { lastName: { $regex: keyword, $options: "i" } },
          ],
        }
      : {};
    const skip = pageIndex * pageSize;

    const items = await User.find(query).skip(skip).limit(pageSize);
    const totalItems = await User.countDocuments(query);
    const result = new PagincationModel({
      pageIndex,
      pageSize,
      items,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    });
    return new Result({
      code: HttpStatusCode.Ok,
      key: ErrorCode.Ok,
      result,
    });
  }

  public async getAllUsers(): Promise<Result<UserModel[]>> {
    const userList = await User.find({});
    return new Result({
      code: HttpStatusCode.Ok,
      key: ErrorCode.Ok,
      result: userList,
    });
  }

  public updateUser = async (
    userDetails: UserModel
  ): Promise<Result<UserModel | null>> => {
    return User.findOneAndUpdate({ id: userDetails.id }, { ...userDetails })
      .then((result) => {
        console.log("result", result);
        return new Result({
          code: result ? HttpStatusCode.Ok : HttpStatusCode.NotFound,
          key: result ? ErrorCode.Ok : ErrorCode.NotFound,
          result,
        });
      })
      .catch((e) => {
        return new Result({
          code:
            e.code === 11000
              ? HttpStatusCode.ConflictError
              : HttpStatusCode.InternalServerError,
          key:
            e.code === 11000
              ? ErrorCode.Conflict
              : ErrorCode.InternalServerError,
          error: e,
        });
      });
  };

  public createUser = async (
    userDetail: UserModel
  ): Promise<Result<UserModel | null>> => {
    try {
      // Check if a user with the same email already exists
      const existingUser = await User.findOne({ email: userDetail.email });
      if (existingUser) {
        return new Result({
          code: HttpStatusCode.ConflictError,
          key: ErrorCode.Conflict,
          error: "User already exist. Please login!",
        });
      }

      // Get the current maximum ID value from the database and increment it by one
      const maxIdUser = await User.findOne({})
        .sort({ id: -1 })
        .select("id")
        .exec();
      const newUserId = maxIdUser ? Number(maxIdUser.id) + 1 : 1;

      // Create a new user object with the generated ID and input data
      const newUser = new User({
        id: newUserId,
        firstName: userDetail.firstName,
        lastName: userDetail.lastName,
        email: userDetail.email,
        roleId: userDetail.roleId,
        role: userDetail.role,
        password: userDetail.password,
      });

      // Save the new user object to the database
      const savedUser = await newUser.save();
      return new Result({
        code: HttpStatusCode.Ok,
        key: ErrorCode.Ok,
        result: savedUser,
      });
    } catch (error: any) {
      return new Result({
        code: HttpStatusCode.InternalServerError,
        key: ErrorCode.InternalServerError,
        error: error,
      });
    }
  };

  public async deleteUser(userId: number): Promise<Result<boolean>> {
    try {
      // Check if the user with the specified ID exists
      const user = await User.findOne({ id: userId });
      if (!user) {
        return new Result({
          code: HttpStatusCode.NotFound,
          key: ErrorCode.NotFound,
          error: `User with ID ${userId} not found`,
        });
      }

      // Delete the user from the database
      await User.deleteOne({ id: userId });

      return new Result({
        code: HttpStatusCode.Ok,
        key: ErrorCode.Ok,
        result: true,
      });
    } catch (error: any) {
      return new Result({
        code: HttpStatusCode.InternalServerError,
        key: ErrorCode.InternalServerError,
        error: error,
      });
    }
  }
}
