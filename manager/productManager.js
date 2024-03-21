import fs from "fs";
export class ProductManager {
    constructor(path){
        this.path = path;
        try {
            let products = fs.readFileSync(this.path, "utf-8");
            this.listOfProducts = JSON.parse(products);
        } catch {
            this.listOfProducts = [];
            fs.writeFile(this.path, JSON.stringify(this.listOfProducts, null, "\t"));
        }
    }
    
    async addProduct(product) {
        if(!product){
            throw new Error("El producto esta vacío");
        }

        let idP = 0;
        if (this.listOfProducts.length == 0){
            idP = 1;
        }
        else {
            idP = this.listOfProducts[this.listOfProducts.length - 1].id + 1;
        }

        const existingId = this.listOfProducts.find((element) => element.code == product.code);
        if(existingId){
            throw new Error("El producto ya existe");
        } 
        else{
            this.listOfProducts.push({...product, id: idP});
            await fs.promises.writeFile(this.path, JSON.stringify(this.listOfProducts, null, "\t"));
        }
    }

    getProducts(){
        return this.listOfProducts;
    }

    getProductById(productId){
        const existingProduct = this.listOfProducts.find((element) => element.id == productId);
        if (existingProduct == undefined){
            throw new Error("Not found with id " + productId);
        }
        else{
            return existingProduct;
        }
    }

    async updateProduct(productId, newData){
        const index = this.listOfProducts.findIndex((element) => element.id == productId);
        if (index >= 0){
            const titleP = newData.title == null ? this.listOfProducts[index].title : newData.title;
            const descriptionP = newData.description == null ? this.listOfProducts[index].description : newData.description;
            const codeP = newData.code == null ? this.listOfProducts[index].code : newData.code;
            const priceP = newData.price == null ? this.listOfProducts[index].price : newData.price;
            const stockP = newData.stock == null ? this.listOfProducts[index].stock : newData.stock;
            const categoryP = newData.category == null ? this.listOfProducts[index].category : newData.category;
            const thumbnailsP = newData.thumbnails == null ? this.listOfProducts[index].thumbnails : newData.thumbnails;
            
            this.listOfProducts[index] = { 
                ...this.listOfProducts[index], 
                title: titleP, 
                description: descriptionP, 
                code: codeP, 
                price: Number(priceP), 
                stock: Number(stockP), 
                category: categoryP, 
                thumbnails: thumbnailsP 
            }
            
            await fs.promises.writeFile(this.path, JSON.stringify(this.listOfProducts, null, "\t"));
        }
        else {
            throw new Error("Producto no encontrado con ese ID");
        }
    }

    async deteleProduct(productId){
        const existingProduct = this.listOfProducts.find((element) => element.id == productId);
        if (existingProduct){
            const newProducts = this.listOfProducts.filter((element) => element.id != productId);

            this.listOfProducts = newProducts;

            await fs.promises.writeFile(this.path, JSON.stringify(this.listOfProducts, null, "\t"));
        }
        else {
            throw new Error("El producto que desea eliminar no existe")
        }
    }
}

export class Product {
    constructor(title, description, price, thumbnail, code, stock, status){
        this.title = title,
        this.description = description,
        this.price = price,
        this.thumbnail = thumbnail,
        this.code = code,
        this.stock = stock,
        this.status = status
    }
}