import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: {
        type: [{
            product: { type: Schema.Types.ObjectId, ref: "products" },
            quantity: { type: Number, required: true, default: 1 } 
        }] 
    }
});

const cartModel = model("carts", cartSchema);

export { cartModel };