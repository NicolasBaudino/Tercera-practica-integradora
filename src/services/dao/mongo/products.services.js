import { productModel } from "../../../models/product.model.js";

export default class productsDAO {
    constructor () {}

    findProducts = async (limit = 10, page = 1, query, sort) => {
        let consult = {}
    
        if (query != undefined){
            consult[query.split(":")[0]] = query.split(":")[1]
        }
    
        return await productModel.paginate(consult,{limit:limit,page:page,sort:sort == undefined ? {}: {price:Number(sort)}})
    }
    
    findProductById = async (id) => {
        return await productModel.findById(id);
    }
    
    createProducts = async (product) => {
        return await productModel.create(product);
    }
    
    updateProducts = async (_id, product) => {
        return await productModel.findByIdAndUpdate(_id, product)
    }
    
    deleteProducts = async (_id) => {
        return await productModel.findByIdAndDelete({ _id });
    }
}

