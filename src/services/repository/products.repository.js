export default class productRepository {
    constructor(dao) {
      this.dao = dao;
    }
  
    findProducts = async (limit, page, sort, query) => {
      return await this.dao.findProducts(limit, page, sort, query);
    };
  
    createProducts = async (product) => {
      try {
        return await this.dao.createProducts(product);
      } catch (error) {
        throw new Error(error.message);
      }
    };
  
    findProductById = async (id) => {
      return await this.dao.findProductById(id);
    };
  
    updateProducts = async (id, product) => {
      return await this.dao.updateProducts(id, product);
    };
  
    deleteProducts = async (id) => {
      return await this.dao.deleteProducts(id);
    };
}