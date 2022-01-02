"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const listener = app.listen(process.env.PORT, function () {
    console.log("Your app is listening on port " + (process.env.PORT ? process.env.PORT : "(failed to detect port)"));
});
app.get("/", (req, res) => res.sendStatus(200));
process.on("SIGINT", () => {
    listener.close();
});
