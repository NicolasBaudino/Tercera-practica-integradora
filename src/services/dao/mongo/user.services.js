import userModel from "../../../models/user.model.js";



export default class userDAO {
    constructor() {}

    updatePassword = async (email, password) => {
      return await userModel.findOneAndUpdate(
        { email: email },
        { password: password }
      );
    }

    getAccountByEmail = async (email) => {
      return await userModel.findOne({ email: email });
    };
}