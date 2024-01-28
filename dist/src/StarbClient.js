"use strict";
/* Copyright (c) 2021-23 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// This code is loaded into starb-client.html, see the `npm compile` and
//   `npm watchify-client` scripts.
// Remember that you will *not* be able to use Node APIs like `fs` in the web browser.
const assert_1 = __importDefault(require("assert"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const drawingPrototype_1 = require("./drawingPrototype");
const Parser_1 = require("./Parser");
const clientADT_1 = require("./clientADT");
const BOX_SIZE = 16;
// categorical colors from
// https://github.com/d3/d3-scale-chromatic/tree/v2.0.0#schemeCategory10
const COLORS = [
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#9467bd',
    '#8c564b',
    '#e377c2',
    '#7f7f7f',
    '#bcbd22',
    '#17becf',
];
/**
 * Puzzle to request and play.
 * Project instructions: this constant is a [for now] requirement in the project spec.
 */
/**
const puzzlePath = `puzzles/kd-1-1-1.starb`
const input = fs.readFileSync(puzzlePath, { encoding: "utf8", flag: "r" });
*/
async function main() {
    // fetch the puzzle
    const puzzleName = 'kd-1-1-1';
    const res = await (0, node_fetch_1.default)(`http://localhost:8789/puzzles/${puzzleName}`);
    const puzzleData = await res.text();
    const puzzle = (0, Parser_1.emptyPuzzleParser)(puzzleData);
    const client = new clientADT_1.Client(puzzle);
    // output area for printing
    const outputArea = document.getElementById('outputArea') ?? assert_1.default.fail('missing output area');
    // canvas for drawing
    const canvas = document.getElementById('canvas') ?? assert_1.default.fail('missing drawing canvas');
    // Change W,H to be divisible by 10
    canvas.height = 250;
    canvas.width = 250;
    // Color in Regions
    (0, drawingPrototype_1.colorAllRegions)();
    // draw grid lines over the colors
    (0, drawingPrototype_1.drawGrid)(canvas);
    // button for checking if solved
    const button = document.getElementById('checkButton') ?? assert_1.default.fail('missing check button');
    // when the user clicks on the drawing canvas...
    button.addEventListener('click', (event) => {
        const isSolved = client.getPuzzle().isSolved();
        const message = isSolved ? 'The puzzle is solved' : 'The puzzle is not solved';
        (0, drawingPrototype_1.printOutput)(outputArea, message);
    });
    // when the user clicks on the drawing canvas...
    canvas.addEventListener('click', (event) => {
        const divisor = 25;
        const initialAdd = 12.5;
        const [row, col] = [((0, drawingPrototype_1.center)(event.offsetY) + initialAdd) / divisor, ((0, drawingPrototype_1.center)(event.offsetX) + initialAdd) / divisor];
        // check if there is a star at the coordinate
        if (client.getPuzzle().getCell(row, col).getMark() === 1) {
            client.addStar(row, col);
            (0, drawingPrototype_1.drawStar)(canvas, (0, drawingPrototype_1.center)(event.offsetX), (0, drawingPrototype_1.center)(event.offsetY));
        }
        else {
            client.removeStar(row, col);
            (0, drawingPrototype_1.removeStar)(canvas, (0, drawingPrototype_1.center)(event.offsetX), (0, drawingPrototype_1.center)(event.offsetY));
        }
        // drawStar(canvas, center(event.offsetX), center(event.offsetY));
        //drawPoint(canvas, center(event.offsetX), center(event.offsetY));
        //removeStar(canvas, center(event.offsetX), center(event.offsetY));
    });
    // add initial instructions to the output area
    (0, drawingPrototype_1.printOutput)(outputArea, `Click on a grid cell to draw a star.`);
}
main();
//# sourceMappingURL=StarbClient.js.map