/* Copyright (c) 2021-23 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

// This file runs in Node.js, see the `npm server` script.
// Remember that you will *not* be able to use DOM APIs in Node, only in the web browser.

import assert from 'assert';
import express, { Request, Response, Application } from 'express';
import HttpStatus from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import { Server } from 'http';
import { join } from 'path';
import fs from 'fs';
import { Puzzle } from './Puzzle';
import { solvedPuzzleParser, loadFile } from './Parser';

const app = express();

const PORT = 8789;
console.log('now listening at http://localhost:' + PORT);

/**
 * HTTP web game server.
 */
export class WebServer {

    private readonly app: Application;
    private server: Server|undefined;
    private port = 8789; //default port is 8789

    /**
     * Make a new web game server using board that listens for connections on port.
     * 
     * @param board shared game board
     * @param requestedPort server port number
     */
    public constructor(
        // private readonly board: Board, 
        private readonly requestedPort: number
    ) {
        this.app = express();
        this.app.use((request, response, next) => {
            // allow requests from web pages hosted anywhere
            response.set('Access-Control-Allow-Origin', '*');
            next();
        });
        // List of Available Puzzles
        const puzzleRoutes: Array<string> = ['kd-1-1-1', 'kd-6-31-6'];

        this.app.get('/puzzles/:name', asyncHandler(async(request, response) => {
            let puzzleName = request.params['name']??'';
            console.log("Puzzle name = ", puzzleName);
            // If the Route Exists:
            if (puzzleRoutes.includes(puzzleName)) {
                puzzleName += '.starb';
                const boardPath = join(`.`, 'puzzles', puzzleName);
                const file = await fs.promises.readFile(boardPath, {encoding: 'utf-8'});
                const emptyPuzzle = solvedPuzzleParser(file);

                response.status(HttpStatus.OK)
                        .type('text')
                        .send(emptyPuzzle.toString());
            // Throw an error if it does not
            } else {
                response.status(HttpStatus.NOT_FOUND)
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
    public start(): Promise<void> {
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
     public stop(): void {
        this.server?.close();
        console.log('server stopped');
    }
}

/**
 * Start a server that serves puzzles from the `puzzles` directory
 * on localhost:8789.
 */
async function main(): Promise<void> {
    const Server = new WebServer(PORT);
    Server.start();
}

if (require.main === module) {
    void main();
}
