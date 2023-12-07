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
exports.deanLogin = exports.registerDean = void 0;
const bcrypt = require('bcrypt');
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
//register dean
const registerDean = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { universityId, password } = req.body;
    try {
        // Hash the password
        const hashedPassword = yield bcrypt.hash(password, 10);
        // Create a new dean in the database
        const newDean = yield prisma.dean.create({
            data: {
                universityId: universityId,
                password: hashedPassword,
            },
        });
        const token = jsonwebtoken_1.default.sign({ universityId: newDean.universityId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Respond with the universityID and JWT token
        res.json({ universityID: newDean.universityId, token });
    }
    catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});
exports.registerDean = registerDean;
//dean login
const deanLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { universityId, password } = req.body;
        const dean = yield prisma.dean.findUnique({
            where: { universityId },
        });
        if (!dean) {
            res
                .status(401)
                .json({ success: false, message: 'Invalid universityId or password' });
            return;
        }
        const passwordMatch = yield bcrypt.compare(password, dean.password);
        if (!passwordMatch) {
            res
                .status(401)
                .json({ success: false, message: 'Invalid universityId or password' });
            return;
        }
        //new JWT token on login
        const authToken = jsonwebtoken_1.default.sign({ universityId }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        res.json({
            success: true,
            message: 'Login successful',
            authToken,
            dean: {
                id: dean.id,
                universityId: dean.universityId,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.deanLogin = deanLogin;
