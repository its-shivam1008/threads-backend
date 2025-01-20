import { User } from ".";
import { prismaClient } from "../../lib/db";

const queries = {
    hello: () => "hey there from graphql server",
    say: (_:any, {name}: {name:String}) => `Hey ${name}, how are you`,
}

const mutations = {
    createUser: async (_:any, {firstName, lastName, email, password} : {firstName:string; lastName:string; email:string; password:string;}) =>{
        await prismaClient.user.create({data:{
            firstName,
            lastName,
            email,
            password,
            salt:"random"
        }})
        return true;
    }
}

export const resolvers = {queries, mutations};