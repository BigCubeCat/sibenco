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
exports.deleteRoute = exports.patchRoute = exports.getRoute = exports.getAll = exports.createRoute = void 0;
const error_1 = require("../utils/error");
const routeService = __importStar(require("../service/route.service"));
const config_1 = require("../config");
const createRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newRoute = yield routeService.createRoute(req.body);
        res.status(200).send(newRoute);
    }
    catch (error) {
        return res.status(500).send((0, error_1.getErrorMessage)(error));
    }
});
exports.createRoute = createRoute;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = typeof req.query.page == 'string' ? Number(req.query.page) : 0;
        const pageSize = typeof req.query.page_size == 'string'
            ? Number(req.query.page_size)
            : config_1.config.PAGE_SIZE;
        const results = yield routeService.getAll(page, pageSize);
        res.status(200).send({ results });
    }
    catch (error) {
        return res.status(500).send((0, error_1.getErrorMessage)(error));
    }
});
exports.getAll = getAll;
const getRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.params.id) {
            return res.status(400).send((0, error_1.getErrorMessage)(new Error('Bad id')));
        }
        const foundRoute = yield routeService.getRoute(req.params.id);
        res.status(200).send(foundRoute);
    }
    catch (error) {
        return res.status(500).send((0, error_1.getErrorMessage)(error));
    }
});
exports.getRoute = getRoute;
const patchRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id ? req.params.id : '';
        if (id == '') {
            return res.status(400).send((0, error_1.getErrorMessage)(new Error('Bad id')));
        }
        const newRoute = yield routeService.patchRoute(req.params.id, req.body);
        res.status(200).send(newRoute);
    }
    catch (error) {
        return res.status(500).send((0, error_1.getErrorMessage)(error));
    }
});
exports.patchRoute = patchRoute;
const deleteRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newRoute = yield routeService.deleteRoute(req.params.id);
        res.status(200).send(newRoute);
    }
    catch (error) {
        return res.status(500).send((0, error_1.getErrorMessage)(error));
    }
});
exports.deleteRoute = deleteRoute;
