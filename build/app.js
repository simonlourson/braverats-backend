"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var dotenv_1 = __importDefault(require("dotenv"));
var routes_1 = require("./routes");
// Create a new express application instance
var app = express();
var App = /** @class */ (function () {
    function App() {
        this.routePrv = new routes_1.Routes();
        // initialize configuration
        dotenv_1.default.config();
        console.log(process.env.ENV_NAME);
        // Create a new express application instance and add middleware
        this.app = express();
        this.app.use(express.json({ limit: '1mb' }));
        this.routePrv.routes(this.app);
    }
    return App;
}());
exports.default = new App().app;
