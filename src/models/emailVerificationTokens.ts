//create an interface (typescript)

import { Model, ObjectId, Schema, model } from "mongoose";
import { hash, compare } from "bcrypt";
interface EmailVerificationTokenDocument {
    owner: ObjectId;
    token: string;
    createdAt: Date;
}

interface Methods{
    compareToken(token: string): Promise<boolean>
}

//expire tokens after one hour (3600 sec)
const emailVerificationTokenSchema = new Schema<EmailVerificationTokenDocument, {}, Methods>(
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

emailVerificationTokenSchema.pre('save', async function(next){
    if(this.isModified('token')) {
        this.token = await hash(this.token, 10)
    }
    
    next()
})


emailVerificationTokenSchema.methods.compareToken = async function(token) {
    const result = await compare(token, this.token)
    return result
}

export default model("EmailVerificationToken", emailVerificationTokenSchema) as Model<EmailVerificationTokenDocument, {}, Methods>;