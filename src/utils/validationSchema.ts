import * as yup from 'yup'
import { isValidObjectId } from 'mongoose'

export const CreateUserSchema = yup.object().shape({
    name: yup.string().trim().required("Name required.").min(3, "Name is too short.").max(20, "Name is too long."),
    email: yup.string().required("Email is missing.").email("Invalid email id."),
    password: yup.string().trim().required("Password is missing.").min(8, "Password is too short.").matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/, "Password requires 8 characters including upper and lower case letters, at least one number and a special character.")
})

export const TokenAndIdValidation = yup.object().shape({
    token: yup.string().trim().required("Invalid token!"),
    userId: yup.string().transform(function(value){
        if(this.isType(value) && isValidObjectId(value)){
        return value
    }
        return ""
    }).required("Invalid userId!")
})
