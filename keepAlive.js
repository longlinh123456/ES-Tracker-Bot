"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const listener = app.listen(port, function () {
    console.log(`Your app is listening on port ${port}`);
});
app.get("/keepalive", (req, res) => res.sendStatus(200));
process.on("SIGINT", () => {
    listener.close();
});
