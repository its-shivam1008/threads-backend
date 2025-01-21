import { User } from ".";
import { prismaClient } from "../../lib/db";
import UserService, { CreateUserPayload } from "../../services/user";

const queries = {
    hello: () => "hey there from graphql server",
    say: (_:any, {name}: {name:String}) => `Hey ${name}, how are you`,
    getUserToken : async (_:any, payload: {email:string; password: string;}) =>{
        const token = await UserService.getUserToken({email:payload.email, password:payload.password})
        return token;
    },
    getCurrentLoggedInUser: async (_:any, parameters:any, context:any) =>{
        if(context && context.user) {
            const id = context.user.id;
            const user = await UserService.getUserById(id);
            return user;
        }
    }
}

const mutations = {
    createUser: async (_:any, payload:CreateUserPayload) =>{
        const res = await UserService.createUser(payload)
        return res.id;
    }
}

export const resolvers = {queries, mutations};