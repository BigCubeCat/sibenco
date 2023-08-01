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
exports.getAll = exports.getRoute = exports.deleteRoute = exports.patchRoute = exports.createRoute = void 0;
const route_model_1 = __importDefault(require("../models/route.model"));
function createRoute(route) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newRoute = yield route_model_1.default.create(route);
            return newRoute;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
}
exports.createRoute = createRoute;
function patchRoute(id, route) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newRoute = yield route_model_1.default.findOneAndUpdate({ _id: id }, route);
            return newRoute;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
}
exports.patchRoute = patchRoute;
function deleteRoute(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield route_model_1.default.findByIdAndRemove(id);
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
}
exports.deleteRoute = deleteRoute;
function getRoute(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const route = yield route_model_1.default.findOne({ _id: id });
            if (!route) {
                throw new Error('not found');
            }
            return route;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
}
exports.getRoute = getRoute;
function getAll(page, page_size) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const allRoutes = yield route_model_1.default.find()
                .sort({ _id: -1 })
                .skip(page * page_size)
                .limit(page_size);
            if (!allRoutes) {
                throw new Error('not found');
            }
            return allRoutes;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    });
}
exports.getAll = getAll;
