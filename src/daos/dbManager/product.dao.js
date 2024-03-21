import { productModel } from "../../models/product.model.js";

class productDao {
    async findProducts(limit = 10, page = 1, query, sort) {
        let consult = {}

        if (query != undefined){
            consult[query.split(":")[0]] = query.split(":")[1]
        }

        return await productModel.paginate(consult,{limit:limit,page:page,sort:sort == undefined ? {}: {price:Number(sort)}})
    }

    async findProductById(id) {
        return await productModel.findById(id);
    }

    async createProducts(product) {
        return await productModel.create(product);
    }

    async updateProducts(_id, product) {
        return await productModel.findOneAndUpdate({ _id }, product)
    }

    async deleteProducts(_id) {
        return await productModel.findByIdAndDelete({ _id });
    }
}

export default new productDao();