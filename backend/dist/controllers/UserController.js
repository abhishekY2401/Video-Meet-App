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
exports.loginUser = exports.registerUser = exports.authenticateUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const authenticateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, pass } = req.body;
    const result = yield (0, exports.loginUser)({ email, pass });
    if (result && result.code === "400") {
        const registeredUser = yield (0, exports.registerUser)({
            username,
            email,
            pass,
        });
        if (registeredUser.code === "200") {
            res.status(200).json(registeredUser.data);
        }
        else {
            res.status(500).json(registeredUser.data);
        }
    }
    if (result && result.code === "401") {
        res.status(400).json("Invalid Password");
    }
    res.status(200).json(result);
});
exports.authenticateUser = authenticateUser;
const registerUser = ({ username, email, pass, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(pass, salt);
        const newUser = new User_1.default({
            username: username,
            email: email,
            pass: hashedPassword,
        });
        const user = yield newUser.save();
        console.log("user successfully created!");
        // return user response
        const response = {
            code: "200",
            data: user,
        };
        return response;
    }
    catch (error) {
        // return error
        const response = {
            code: "500",
            data: error,
        };
        return response;
    }
});
exports.registerUser = registerUser;
const loginUser = ({ email, pass, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findOne({ email: email });
        if (!user) {
            const response = {
                code: "400",
                data: "Email does not exists",
            };
            return response;
        }
        const validatePass = yield bcrypt_1.default.compare(pass, user.password);
        if (!validatePass) {
            const response = {
                code: "401",
                data: "Wrong password, please enter it correctly",
            };
            return response;
        }
        const userResponse = {
            code: "200",
            data: user,
        };
        return userResponse;
    }
    catch (error) {
        const errResponse = {
            code: "500",
            data: "Login Failed",
        };
        return errResponse;
    }
});
exports.loginUser = loginUser;
