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
exports.findSiilarOrders = exports.findOrdersBySomething = exports.updateOrder = exports.deleteOrder = exports.getAllOrders = exports.getOrder = exports.createOrder = void 0;
const fs_1 = require("fs");
const order_model_1 = __importDefault(require("../models/order.model"));
const properties_file_1 = require("properties-file");
const properties = (0, properties_file_1.getProperties)((0, fs_1.readFileSync)('./properties/error_messedge_en.properties'));
function createOrder(order) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!(yield order_model_1.default.create(order))) {
                throw new Error(properties.errorCreate);
            }
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
}
exports.createOrder = createOrder;
function getOrder(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const order = yield order_model_1.default.findById(id);
            if (!order) {
                throw new Error(properties.errorGet);
            }
            return order;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
}
exports.getOrder = getOrder;
function getAllOrders(page, pageSize) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const orders = yield order_model_1.default.find({})
                .sort({ _id: -1 })
                .skip(page * pageSize)
                .limit(pageSize);
            if (!orders) {
                throw new Error(properties.errorNoOrders);
            }
            return orders;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
}
exports.getAllOrders = getAllOrders;
function deleteOrder(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!(yield order_model_1.default.findByIdAndDelete(id))) {
                throw new Error(properties.errorDelete);
            }
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
}
exports.deleteOrder = deleteOrder;
function updateOrder(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!(yield order_model_1.default.findByIdAndUpdate(id, data, { upset: true }))) {
                throw new Error(properties.errorUpdate);
            }
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
}
exports.updateOrder = updateOrder;
function findOrdersBySomething(data, page, pageSize) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const orders = yield order_model_1.default.find({ data })
                .sort({ _id: -1 })
                .skip(page * pageSize)
                .limit(pageSize);
            if (!orders) {
                throw new Error(properties.errorNoOrders);
            }
            ;
            return orders;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
}
exports.findOrdersBySomething = findOrdersBySomething;
function findSiilarOrders() {
    return __awaiter(this, void 0, void 0, function* () {
        // TO_DO Create metric
    });
}
exports.findSiilarOrders = findSiilarOrders;
