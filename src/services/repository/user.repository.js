export default class userRepository {
    constructor(dao) {
      this.dao = dao;
    }
    
    updatePassword = async (email, password) => {
        return await this.dao.updatePassword(email, password);
    };

    getAccountByEmail = async (email) => {
      return await this.dao.getAccountByEmail(email);
    };
}