import mongoose from "mongoose";

export interface IUser {
    fullName: string;
    username: string;
    email: string;
    password: string;
    role: string;
    profilePicture: string;
    isActive: boolean;
    isVerified: boolean;
    isDeleted: boolean;
    isBlocked: boolean;
    isSuspended: boolean;
    activationCode: string;
    createdAt: Date;
    updatedAt: Date;
}

const schema = mongoose.Schema;

const userSchema = new schema({
fullName: {
    type: schema.Types.String,
    required: true,
},
username: {
    type: schema.Types.String,
    required: true,
},
email: {
    type: schema.Types.String,
    required: true,
},
password: {
    type: schema.Types.String,
    required: true,
},
role: {
    type: schema.Types.String,
    enum: ["admin", "user"],
    default: "user",
},
profilePicture: {
    type: schema.Types.String,
    default: "user.png",
},
isActive: {
    type: schema.Types.Boolean,
default: false,
},
isVerified: {
    type: schema.Types.Boolean,
default: false,
},
isDeleted: {
    type: schema.Types.Boolean,
default: false,
},
isBlocked: {
    type: schema.Types.Boolean,
default: false,
},
isSuspended: {
    type: schema.Types.Boolean,
default: false,
},
activationCode: {
    type: schema.Types.String,

},
createdAt: {
    type: schema.Types.Date,

},
updatedAt: {
    type: schema.Types.Date,

},
}, {
    timestamps: true,
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
