import fs from "fs";
export default class cartManager {
    constructor(path){
        this.path = path;
        try {
            let carts = fs.readFileSync(this.path, "utf-8");
            this.listOfCarts = JSON.parse(carts);
        } catch {
            this.listOfCarts = [];
            fs.writeFile(this.path, JSON.stringify(this.listOfCarts, null, "\t"));
        }
    }
    
    async addCart() {
        let idCart = 0;
        if (this.listOfCarts.length == 0){
            idCart = 1;
        }
        else {
            idCart = this.listOfCarts[this.listOfCarts.length - 1].id + 1;
        }

        this.listOfCarts.push({id: idCart, products: []});
        await fs.promises.writeFile(this.path, JSON.stringify(this.listOfCarts, null, "\t"));
        
    }

    async addProductCart(cartId, productId) {
        const index = this.listOfCarts.findIndex((element) => element.id == Number(cartId));
        if (index >= 0){
            const findProduct = this.listOfCarts[index].products.find((element) => element.product == Number(productId));
            if(findProduct) {
                this.listOfCarts[index].products[this.listOfCarts[index].products.findIndex((element) => element.product == Number(productId))].quantity += 1;
            }
            else {
                this.listOfCarts[index].products.push({"product": Number(productId), "quantity": 1});
            }
            
            
            await fs.promises.writeFile(this.path, JSON.stringify(this.listOfCarts, null, "\t"));
        }
        else {
            throw new Error("Producto no encontrado con ese ID");
        }
    }

    getCarts(){
        return this.listOfCarts;
    }

    getCartById(cartId){
        const existingCart = this.listOfCarts.find((element) => element.id == cartId);
        if (existingCart == undefined){
            throw new Error("Not found with id " + cartId);
        }
        else{
            return existingCart;
        }
    }

    
}

export class Cart {
    constructor(){
        this.products = [];
    }
}