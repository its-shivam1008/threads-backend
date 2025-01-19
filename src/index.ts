import express from "express";
import { ApolloServer } from "@apollo/server";
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
        `,
        resolvers:{
            Query:{
                hello: () => "hey there from graphql server",
                say: (_, {name}: {name:String}) => `Hey ${name}, how are you`,
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