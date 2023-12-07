"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const deanContoller_1 = require("../controllers/deanContoller");
router.route('/signup').post(deanContoller_1.registerDean);
router.route('/login').post(deanContoller_1.deanLogin);
module.exports = router;
