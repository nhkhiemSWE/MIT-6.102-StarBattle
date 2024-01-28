"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
describe('server', function () {
    /**
     * Testing Strategy for WebServer
     *      partition on valid / invalid path
     */
    it('Covers valid route', async () => {
        const request = require('supertest');
        const app = require('../app');
        const response = await request(app).get('/puzzles/kd-1-1-1');
        assert_1.default.strictEqual(response.status, 200);
        assert_1.default.strictEqual(response.type, 'text');
        (0, assert_1.default)(response.text.length > 0);
        console.log("a");
    });
    it('Cover invalid puzzle', async () => {
        const request = require('supertest');
        const app = require('../app');
        const response = await request(app).get('/fakepath');
        assert_1.default.strictEqual(response.status, 404); // Throws an error
    });
});
//# sourceMappingURL=webAPITest.js.map