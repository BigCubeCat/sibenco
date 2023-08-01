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
const node_fetch_1 = __importDefault(require("node-fetch"));
function getRoute(address) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, node_fetch_1.default)(address, {
                method: "GET"
            });
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }
            const result = (yield response.json());
            console.log(result.routes[0].legs[0].steps[132]);
        }
        catch (error) {
            if (error instanceof Error) {
                console.log('error message: ', error.message);
            }
            else {
                console.log('unexpected error: ', error);
            }
        }
    });
}
function getTrip(address) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, node_fetch_1.default)(address, {
                method: "GET"
            });
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }
            const result = (yield response.json());
            console.log(result);
        }
        catch (error) {
            if (error instanceof Error) {
                console.log('error message: ', error.message);
            }
            else {
                console.log('unexpected error: ', error);
            }
        }
    });
}
const requestOptions = {
    method: 'GET',
};
function getGeoCode() {
    (0, node_fetch_1.default)("https://api.geoapify.com/v1/geocode/search?text=254%20Антона%20Петрова%20Улица%2C%20Барнаул%2C%20Российская%20Федерация&apiKey=2481c54dc9de4bd999aed241c464c094", requestOptions)
        .then(response => response.json())
        .then((result) => {
        console.log(result.features[0].properties.lon);
        console.log(result.features[0].properties.lat);
    })
        .catch(error => console.log('error', error));
}
getRoute("http://localhost:5000/route/v1/driving/144.95800,-37.85247;152.930,-27.508?steps=true");
//getGeoCode();
