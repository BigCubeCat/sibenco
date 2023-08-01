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
exports.findOrdersBySomething = exports.updateOrder = exports.deleteOrder = exports.getAllOrders = exports.getOrder = exports.createOrder = void 0;
const error_1 = require("../utils/error");
const orderService = __importStar(require("../service/order.service"));
const config_1 = require("../config");
const properties_file_1 = require("properties-file");
const fs_1 = require("fs");
const properties = (0, properties_file_1.getProperties)((0, fs_1.readFileSync)('./properties/messedge_en.properties'));
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield orderService.createOrder(req.body);
        res.status(200).send(properties.successOrderCreate);
    }
    catch (error) {
        return res.status(500).send((0, error_1.getErrorMessage)(error));
    }
});
exports.createOrder = createOrder;
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.params.id) {
            return res.status(400).send((0, error_1.getErrorMessage)(new Error(properties.errorOrderBadId)));
        }
        const order = yield orderService.getOrder(req.params.id);
        res.status(200).send(order);
    }
    catch (error) {
        return res.status(500).send((0, error_1.getErrorMessage)(error));
    }
});
exports.getOrder = getOrder;
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = typeof req.query.page == 'string' ? Number(req.query.page) : 0;
        const pageSize = typeof req.query.page_size == 'string'
            ? Number(req.query.page_size)
            : config_1.config.PAGE_SIZE;
        const orders = yield orderService.getAllOrders(page, pageSize);
        res.status(200).send({ orders });
    }
    catch (error) {
        return res.status(500).send((0, error_1.getErrorMessage)(error));
    }
});
exports.getAllOrders = getAllOrders;
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.params.id) {
            return res.status(400).send((0, error_1.getErrorMessage)(new Error(properties.errorOrderBadId)));
        }
        yield orderService.deleteOrder(req.params.id);
        res.status(200).send(properties.successOrderDelete);
    }
    catch (error) {
        return res.status(500).send((0, error_1.getErrorMessage)(error));
    }
});
exports.deleteOrder = deleteOrder;
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.params.id) {
            return res.status(400).send((0, error_1.getErrorMessage)(new Error(properties.errorOrderBadId)));
        }
        yield orderService.updateOrder(req.params.id, req.body);
        res.status(200).send(properties.successOrderUpdtae);
    }
    catch (error) {
        return res.status(500).send((0, error_1.getErrorMessage)(error));
    }
});
exports.updateOrder = updateOrder;
const findOrdersBySomething = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = typeof req.query.page == 'string' ? Number(req.query.page) : 0;
        const pageSize = typeof req.query.page_size == 'string'
            ? Number(req.query.page_size)
            : config_1.config.PAGE_SIZE;
        const orders = yield orderService.findOrdersBySomething(req.body, page, pageSize);
        res.status(200).send({ orders });
    }
    catch (error) {
        return res.status(500).send((0, error_1.getErrorMessage)(error));
    }
});
exports.findOrdersBySomething = findOrdersBySomething;
