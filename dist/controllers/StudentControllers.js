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
exports.studentLogin = exports.studentSignup = void 0;
const bcrypt = require('bcrypt');
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
//student sign up
const studentSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { universityId, password } = req.body;
        const hashedPassword = yield bcrypt.hash(password, 10);
        // unique token
        const authToken = (0, uuid_1.v4)();
        const user = yield prisma.student.create({
            data: {
                universityId,
                password: hashedPassword,
                authToken,
            },
        });
        const { universityId: userId, authToken: userAuthToken, createdAt } = user;
        // Create a JWT token
        const accessToken = jsonwebtoken_1.default.sign({ universityId: userId, authToken: userAuthToken }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        res.json({ universityId: userId, authToken: accessToken, createdAt });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.studentSignup = studentSignup;
//student login
const studentLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { universityId, password } = req.body;
        const student = yield prisma.student.findUnique({
            where: { universityId },
        });
        if (!student) {
            res
                .status(401)
                .json({ success: false, message: 'Invalid universityId or password' });
            return;
        }
        const passwordMatch = yield bcrypt.compare(password, student.password);
        if (!passwordMatch) {
            res
                .status(401)
                .json({ success: false, message: 'Invalid universityId or password' });
            return;
        }
        // Generate a new JWT token
        const authToken = jsonwebtoken_1.default.sign({ universityId }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        // JWT token and any other relevant information
        res.json({
            success: true,
            message: 'Login successful',
            authToken,
            student: {
                // id: student.id, //this is the autoincement id
                universityId: student.universityId,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.studentLogin = studentLogin;
