"use strict";
/* Copyright (c) 2021-23 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebServer = void 0;
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
const Parser_1 = require("./Parser");
const app = (0, express_1.default)();
const PORT = 8789;
console.log('now listening at http://localhost:' + PORT);
/**
 * HTTP web game server.
 */
class WebServer {
    /**
     * Make a new web game server using board that listens for connections on port.
     *
     * @param board shared game board
     * @param requestedPort server port number
     */
    constructor(
    // private readonly board: Board, 
    requestedPort) {
        this.requestedPort = requestedPort;
        this.port = 8789; //default port is 8789
        this.app = (0, express_1.default)();
        this.app.use((request, response, next) => {
            // allow requests from web pages hosted anywhere
            response.set('Access-Control-Allow-Origin', '*');
            next();
        });
        // List of Available Puzzles
        const puzzleRoutes = ['kd-1-1-1', 'kd-6-31-6'];
        this.app.get('/puzzles/:name', (0, express_async_handler_1.default)(async (request, response) => {
            let puzzleName = request.params['name'] ?? '';
            console.log("Puzzle name = ", puzzleName);
            // If the Route Exists:
            if (puzzleRoutes.includes(puzzleName)) {
                puzzleName += '.starb';
                const boardPath = (0, path_1.join)(`.`, 'puzzles', puzzleName);
                const file = await fs_1.default.promises.readFile(boardPath, { encoding: 'utf-8' });
                const emptyPuzzle = (0, Parser_1.solvedPuzzleParser)(file);
                response.status(http_status_codes_1.default.OK)
                    .type('text')
                    .send(emptyPuzzle.toString());
                // Throw an error if it does not
            }
            else {
                response.status(http_status_codes_1.default.NOT_FOUND)
                    .type('text')
                    .send(`This route does not exist, the available routes are ${puzzleRoutes}`);
            }
        }));
    }
    /**
     * Start this server.
     *
     * @returns (a promise that) resolves when the server is listening
     */
    start() {
        return new Promise(resolve => {
            this.server = this.app.listen(this.requestedPort, () => {
                console.log('server now listening at', this.port);
                resolve();
            });
        });
    }
    /**
     * Stop this server. Once stopped, this server cannot be restarted.
     */
    stop() {
        this.server?.close();
        console.log('server stopped');
    }
}
exports.WebServer = WebServer;
/**
 * Start a server that serves puzzles from the `puzzles` directory
 * on localhost:8789.
 */
async function main() {
    const Server = new WebServer(PORT);
    Server.start();
}
if (require.main === module) {
    void main();
}
//# sourceMappingURL=StarbServer.js.map