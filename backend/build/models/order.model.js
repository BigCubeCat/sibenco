"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const OrderSchema = new mongoose_1.default.Schema({
    typeOfTrasportation: {
        type: String,
        unique: false,
        required: true,
    },
    date: {
        type: Date,
        unique: false,
        required: true
    },
    loadigAdress: {
        type: String,
        unique: false,
        required: true
    },
    unloadingAdress: {
        type: String,
        unique: false,
        required: true
    },
    cargoName: {
        type: String,
        unique: false,
        required: true
    },
    distance: {
        type: String,
        unique: false,
        required: true
    },
    specialMarks: {
        type: String,
        unique: false,
        required: false
    },
    client: {
        type: String,
        unique: false,
        require: true
    }
});
const OrderModel = mongoose_1.default.model("OrderModel", OrderSchema);
exports.default = OrderModel;
