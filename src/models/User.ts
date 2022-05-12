import { Model, Schema, Document, model } from "mongoose"

export interface UserDocument extends Document {
    _id: string;
    username: string;
    avatar: string;
}

export const UserSchema: Schema = new Schema({
    _id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
});

const User: Model<UserDocument> = model("User", UserSchema);
export default User