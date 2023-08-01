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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdminMiddleware = void 0;
const auth_1 = require("../utils/auth");
const config_1 = require("../config");
const isAdminMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if ((0, auth_1.emailFromToken)(req) != config_1.config.admin.email) {
            throw new Error();
        }
        next();
    }
    catch (err) {
        res.status(401).send('Please authenticate');
    }
});
exports.isAdminMiddleware = isAdminMiddleware;
