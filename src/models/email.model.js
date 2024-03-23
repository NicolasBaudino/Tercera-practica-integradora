import { Schema, model } from "mongoose";

const emailCollection = "recoveryEmail";

const emailSchema = new Schema({
  tokenId: { type: String, required: true },
  email: { type: String, required: true },
  expirationTime: { type: Date, required: true },
});

const emailModel = model(emailCollection, emailSchema);

export default emailModel;