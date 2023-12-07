"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const StudentControllers_1 = require("../controllers/StudentControllers");
router.route('/signup').post(StudentControllers_1.studentSignup);
router.route('/login').post(StudentControllers_1.studentLogin);
module.exports = router;
