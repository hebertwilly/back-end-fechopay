import {model, Schema, Document} from "mongoose";


export interface StoreDocument extends Document {
  name: string;
  slug: string;
  email: string;
  password: string;
  whatsappNumber: string;
  plan: string;
  createdAt: Date;
  updatedAt: Date;
}

const storeSchema = new Schema<StoreDocument> ({
    name: {type: String, trim: true, required: true},
    slug: { type: String, unique: true, lowercase: true, required: true},
    email: {type: String, unique: true, lowercase: true, trim: true,  required: true},
    password: {type: String, required: true},
    whatsappNumber: {type: String, required: true},
    plan: {type: String, default: "free"},
},
{
    timestamps: true,
})

export const Store = model<StoreDocument>("Store", storeSchema);