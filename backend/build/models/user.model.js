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
exports.userWithoutPass = exports.generatePasswordHash = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const saltRounds = 8;
const UserSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        unique: false,
        required: true,
        minlength: 2,
        maxlength: 1500
    },
    surname: {
        type: String,
        unique: false,
        required: true,
        minlength: 2,
        maxlength: 1500
    },
    lastname: {
        type: String,
        unique: false,
        required: true,
        minLength: 2,
        maxlength: 1500
    },
    role: {
        type: String,
        unique: false,
        required: true
    },
    password: {
        type: String,
        unique: false,
        required: true,
        minlength: 5,
        maxlength: 50
    },
});
function generatePasswordHash(password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.hash(password, saltRounds);
    });
}
exports.generatePasswordHash = generatePasswordHash;
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.isModified('password')) {
            user.password = yield generatePasswordHash(user.password);
        }
        next();
    });
});
// return public user information
function userWithoutPass(user) {
    // TODO user type
    console.log(typeof user);
    return {
        email: user.email,
        name: user.name,
        surname: user.surname,
        lastname: user.lastname,
        role: user.role,
    };
}
exports.userWithoutPass = userWithoutPass;
const UserModel = mongoose_1.default.model('User', UserSchema);
exports.default = UserModel;
