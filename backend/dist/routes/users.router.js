"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
// External Dependencies
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../controllers/UserController");
// Global Config
exports.userRouter = express_1.default.Router();
exports.userRouter.use(express_1.default.json());
exports.userRouter.post("/authenticate", UserController_1.authenticateUser);
