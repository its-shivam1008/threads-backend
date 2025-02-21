"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const graphql_1 = __importDefault(require("./graphql"));
const user_1 = __importDefault(require("./services/user"));
// import {expressMiddleware} from "@apollo/server/express4"
const app = (0, express_1.default)();
// const {ApolloServer} = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = Number(process.env.PORT) || 8000;
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        app.use(bodyParser.json());
        app.use(cors());
        const server = yield (0, graphql_1.default)();
        app.use("/graphql", expressMiddleware(server, {
            // @ts-ignore
            context: (_a) => __awaiter(this, [_a], void 0, function* ({ req }) {
                const token = req.headers['token'];
                try {
                    const user = yield user_1.default.decodeJwtToken(token);
                    return { user };
                }
                catch (error) {
                    return {};
                }
            })
        }));
        app.get('/', (req, res) => {
            res.json({ message: "hey what yo doing" });
        });
        app.listen(PORT, () => console.log(`Server started at Port:${PORT}`));
    });
}
init();
