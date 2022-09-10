"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.datesToDue = void 0;
const moment_1 = __importDefault(require("moment"));
const datesToDue = (date) => {
    const eventDate = (0, moment_1.default)(date).local();
    const today = (0, moment_1.default)().local();
    const diffMinutes = eventDate.diff(today, 'minutes');
    if (diffMinutes > 10080)
        return 8;
    else if (diffMinutes <= 10080 && diffMinutes > 4320)
        return 7;
    else if (diffMinutes <= 4320 && diffMinutes > 1440)
        return 3;
    else if (diffMinutes <= 1440 && diffMinutes > 0)
        return 1;
    else
        return -1;
};
exports.datesToDue = datesToDue;
