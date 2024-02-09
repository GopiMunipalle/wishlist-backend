"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = __importDefault(require("../controllers/userController"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post("/singIn", userController_1.default.singIn);
router.post("/login", userController_1.default.login);
router.get("/get", userController_1.default.moviesList);
exports.default = router;
