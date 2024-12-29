import mongoose, { Schema } from "mongoose";
import { Document } from "mongoose";

export interface ICategory extends Document{
    name:string;
    description:string;
}

const CategorySchema = new Schema<ICategory>({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        default:"No aplica"
    },
});


export const Category = mongoose.model<ICategory>("Category",CategorySchema);
