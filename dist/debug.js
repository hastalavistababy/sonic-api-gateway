"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debug = void 0;
exports.Debug = function (logText) {
    if (process.env.debug == 'logging') {
        console.log(logText);
    }
};
