"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const listener = app.listen(process.env.PORT, function () {
    console.log("Your app is listening on port " + process.env.port ? process.env.port : "(failed to detect port)");
});
process.on("SIGINT", () => {
    listener.close();
});
