"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailFromToken = void 0;
const emailFromToken = (req) => {
    const token = req.token;
    const tokenStirng = typeof token === 'string' ? token : token === null || token === void 0 ? void 0 : token.email;
    return tokenStirng;
};
exports.emailFromToken = emailFromToken;
