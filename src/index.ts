import express from "express";
import { ApolloServer } from "@apollo/server";
import { prismaClient } from "./lib/db";
import createGraphqlServer from "./graphql";
import UserService from "./services/user";
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

    const server = await createGraphqlServer();
    app.use("/graphql", expressMiddleware(server, {
        // @ts-ignore
        context: async ({req}) => {
            const token = req.headers['token']
            try {
                const user = await UserService.decodeJwtToken(token as string) ;
                return {user};
            } catch (error) {
                return {};
            }
        }
    }));


    app.get('/', (req, res)=>{
        res.json({message:"hey what yo doing"});
    })

    app.listen(PORT, ()=> console.log(`Server started at Port:${PORT}`));
}

init();