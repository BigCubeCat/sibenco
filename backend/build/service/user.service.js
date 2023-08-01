"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.searchUsers = exports.patchUser = exports.getOtherUser = exports.getUser = exports.login = exports.createUser = exports.createAdmin = void 0;
const user_model_1 = __importStar(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
function createAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = { email: config_1.config.admin.email };
        const pass = yield (0, user_model_1.generatePasswordHash)(config_1.config.admin.password);
        const update = { password: pass, role: 'admin' };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        yield user_model_1.default.findOneAndUpdate(query, update, options);
    });
}
exports.createAdmin = createAdmin;
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newUser = yield user_model_1.default.create(user);
            return (0, user_model_1.userWithoutPass)(newUser);
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
}
exports.createUser = createUser;
function login(user) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const foundUser = yield user_model_1.default.findOne({ email: user.email });
            if (!foundUser) {
                throw new Error('Name of user is not correct');
            }
            const isMatch = bcryptjs_1.default.compareSync(user.password, foundUser.password);
            if (isMatch) {
                const token = jsonwebtoken_1.default.sign({ _id: (_a = foundUser._id) === null || _a === void 0 ? void 0 : _a.toString(), email: foundUser.email }, config_1.config.JWT_SECRET);
                return {
                    user: (0, user_model_1.userWithoutPass)(foundUser),
                    token: token,
                };
            }
            else {
                throw new Error('Password is not correct');
            }
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
}
exports.login = login;
function getUser(_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const foundUser = yield user_model_1.default.findOne({ _id });
            if (!foundUser) {
                throw new Error('User incorrect');
            }
            return foundUser;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
}
exports.getUser = getUser;
function getOtherUser(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const foundUser = yield user_model_1.default.findOne({ email });
            if (!foundUser) {
                throw new Error('User incorrect');
            }
            return (0, user_model_1.userWithoutPass)(foundUser);
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
}
exports.getOtherUser = getOtherUser;
function patchUser(email, newData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const foundUser = yield user_model_1.default.findOneAndUpdate({ email }, newData, {
                upsert: true,
            });
            if (!foundUser) {
                throw new Error('Error');
            }
            return (0, user_model_1.userWithoutPass)(foundUser);
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
}
exports.patchUser = patchUser;
function searchUsers(email, name, surname) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield user_model_1.default.find({
                username: { $regex: email },
                name: { $regex: name },
                surname: { $regex: surname },
            }).limit(20);
            const withoutPasswords = users.map((user) => (0, user_model_1.userWithoutPass)(user));
            return withoutPasswords;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
}
exports.searchUsers = searchUsers;
