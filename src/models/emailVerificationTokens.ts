//create an interface (typescript)

import { Model, ObjectId, Schema, model } from "mongoose";

interface EmailVerificationTokenDocument {
    owner: ObjectId;
    token: string;
    createdAt: Date;
}

//expire tokens after one hour (3600 sec)
const emailVerificationTokenSchema = new Schema<EmailVerificationTokenDocument>(
    {
        owner: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        token: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            expires: 3600, //60min * 60 sec = 3600
            default: Date.now()
        }
    },
    {timestamps: true}
);

export default model("EmailVerificationToken", emailVerificationTokenSchema) as Model<EmailVerificationTokenDocument>;