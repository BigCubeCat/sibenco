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
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = exports.patchMe = exports.getUser = exports.getMe = exports.loginOne = exports.createUser = void 0;
const error_1 = require("../utils/error");
const userServices = __importStar(require("../service/user.service"));
const user_model_1 = require("../models/user.model");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = yield userServices.createUser(req.body);
        res.status(200).send((0, user_model_1.userWithoutPass)(newUser));
    }
    catch (error) {
        return res.status(500).send((0, error_1.getErrorMessage)(error));
    }
});
exports.createUser = createUser;
const loginOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundUser = yield userServices.login(req.body);
        res.status(200).send(foundUser);
    }
    catch (error) {
        return res.status(500).send((0, error_1.getErrorMessage)(error));
    }
});
exports.loginOne = loginOne;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.token;
        const tokenStirng = typeof token === 'string' ? token : token === null || token === void 0 ? void 0 : token.email;
        const foundUser = yield userServices.getUser(tokenStirng);
        res.status(200).send(foundUser);
    }
    catch (error) {
        return res.status(500).send((0, error_1.getErrorMessage)(error));
    }
});
exports.getMe = getMe;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundUser = yield userServices.getOtherUser(req.params.email);
        res.status(200).send(foundUser);
    }
    catch (error) {
        return res.status(500).send((0, error_1.getErrorMessage)(error));
    }
});
exports.getUser = getUser;
const patchMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.token;
        const tokenStirng = typeof token === 'string' ? token : token === null || token === void 0 ? void 0 : token._id;
        const foundUser = yield userServices.patchUser(tokenStirng, req.body);
        res.status(200).send(foundUser);
    }
    catch (error) {
        return res.status(500).send((0, error_1.getErrorMessage)(error));
    }
});
exports.patchMe = patchMe;
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stringUsername = typeof req.query.username === 'string' ? req.query.username : '';
        const stringName = typeof req.query.name === 'string' ? req.query.name : '';
        const stringSurname = typeof req.query.surname === 'string' ? req.query.surname : '';
        const foundUsers = yield userServices.searchUsers(stringUsername, stringName, stringSurname);
        res.status(200).send({ users: foundUsers });
    }
    catch (error) {
        return res.status(500).send((0, error_1.getErrorMessage)(error));
    }
});
exports.search = search;
