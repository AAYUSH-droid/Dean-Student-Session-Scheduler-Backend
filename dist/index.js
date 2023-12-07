"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const prisma = new client_1.PrismaClient();
app.get('/', (req, res) => {
    res.send('Hello World!');
});
//student api
const studentAPI = require('./routes/authRoutes');
app.use('/api/v1/student', studentAPI);
//dean api
const deanAPI = require('./routes/deanRoute');
app.use('/api/v1/dean', deanAPI);
app.listen(port, () => console.log(`Server is working on http://localhost:${port}`));
