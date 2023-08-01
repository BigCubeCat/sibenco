"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RouteShema = new mongoose_1.default.Schema({
    points: [{ type: String }],
    summary_distance: { type: String },
    ts_number: { type: String },
    special_marks: { type: String },
    driver_name: { type: String },
});
const RouteModel = mongoose_1.default.model('Route', RouteShema);
exports.default = RouteModel;
