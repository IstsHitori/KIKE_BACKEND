import mongoose, { Schema } from "mongoose"

export interface IUser{
    user:string,
    password:string
}

const UserSchema:Schema = new Schema({
    user:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

export const User = mongoose.model<IUser>("User",UserSchema);