import express from "express";
import { ApolloServer } from "@apollo/server";
import { prismaClient } from "./lib/db";
// import {expressMiddleware} from "@apollo/server/express4"
const app = express();
// const {ApolloServer} = require("@apollo/server");
const {expressMiddleware} = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors")
const PORT = Number(process.env.PORT) || 8000;

async function init() {
    app.use(bodyParser.json());
    app.use(cors());

    const server = new ApolloServer({
        typeDefs:`
            type Query {
                hello: String
                say(name: String): String
            }
            type Mutation {
                createUser(firstName:String!, lastName:String!, email:String!, password:String!) : Boolean
            }
        `,
        resolvers:{
            Query:{
                hello: () => "hey there from graphql server",
                say: (_, {name}: {name:String}) => `Hey ${name}, how are you`,
            },
            Mutation:{
                createUser: async (_, {firstName, lastName, email, password} : {firstName:string; lastName:string; email:string; password:string;}) =>{
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
        }
    })

    await server.start();
    app.use("/graphql", expressMiddleware(server));


    app.get('/', (req, res)=>{
        res.json({message:"hey what yo doing"});
    })

    app.listen(PORT, ()=> console.log(`Server started at Port:${PORT}`));
}

init();