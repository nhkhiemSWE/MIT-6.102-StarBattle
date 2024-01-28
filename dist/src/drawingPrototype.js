"use strict";
/* Copyright (c) 2021-23 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorAllRegions = exports.center = exports.printOutput = exports.drawGrid = exports.drawPoint = exports.removeStar = exports.drawStar = void 0;
// This code is loaded into example-page.html, see the `npm watchify-example` script.
// Remember that you will *not* be able to use Node APIs like `fs` in the web browser.
const Parser_1 = require("./Parser");
const Puzzle_1 = require("./Puzzle");
const assert_1 = __importDefault(require("assert"));
const canvas_size = 250;
const numCells = 10;
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
const input = `# This is an solved Puzzle
# This is a second comment that contains a lot of characters: 12345678890!@#$%^&*()_+<>?:"|}{[]p}
10x10
1,2  1,5  | 1,1 1,3 1,4 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
2,9  4,10 | 1,9 1,10 2,10 3,9 3,10 4,9 5,9 5,10 6,9 6,10 7,10 8,10
3,2  3,4  | 3,3
2,7  4,8  | 3,6 3,7 3,8
6,1  9,1  | 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6
5,4  5,6  | 4,5 5,5 6,4 6,5 6,6
6,8  8,7  | 4,6 4,7 5,7 5,8 6,7 7,6 7,7 7,8 8,8
7,3  7,5  | 6,3 7,4 
8,9 10,10 | 7,9 9,9 9,10
9,3  10,6 | 9,2 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,7 10,8 10,9
`;
//const input = loadFile(`/puzzles/kd-1-1-1.starb`);
const puzzleADT = (0, Parser_1.solvedPuzzleParser)(input);
/**
 * Given a cell which is the intersection of row and col, we will draw a star in that cell.
 * This happens when the client wants to put a star on the board at the specific cell.
 * @param canvas canvas to draw on
 * @param row, row of the board
 * @param col, col of the board
 */
function drawStar(canvas, row, col) {
    const context = canvas.getContext('2d');
    (0, assert_1.default)(context, 'unable to get canvas drawing context');
    // save original context settings before we translate and change colors
    context.save();
    // translate the coordinate system of the drawing context:
    //   the origin of `context` will now be (x,y)
    context.translate(row, col);
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    const radius = 8;
    context.beginPath();
    for (let i = 0; i < 5; i++) {
        const x = radius * Math.cos(60 + (2 * Math.PI * i) / 5);
        const y = radius * Math.sin(60 + (2 * Math.PI * i) / 5);
        context.lineTo(x, y);
        const innerX = radius / 2 * Math.cos(60 + (2 * Math.PI * i + Math.PI) / 5);
        const innerY = radius / 2 * Math.sin(60 + (2 * Math.PI * i + Math.PI) / 5);
        context.lineTo(innerX, innerY);
    }
    context.closePath();
    // draw the star outline and fill
    context.stroke();
    context.fillStyle = 'black';
    context.fill();
    console.log("Row", (col + 12.5) / 25, "Col", (row + 12.5) / 25);
    // reset the origin and styles back to defaults
    context.restore();
}
exports.drawStar = drawStar;
/**
 * Given a cell which is the intersection of row and col, we will remove a star in that cell if a
 * star is present. This code should only be executed if there is a star present in the cell
 * @param canvas, canvas to draw on
 * @param row, row of the board
 * @param col, col of the board
 */
function removeStar(canvas, row, col) {
    const context = canvas.getContext('2d');
    (0, assert_1.default)(context, 'unable to get canvas drawing context');
    // save original context settings before we translate and change colors
    context.save();
    // translate the coordinate system of the drawing context:
    //   the origin of `context` will now be (x,y)
    const cellSize = canvas_size / numCells;
    const offset = cellSize / 2;
    const imgData = context.getImageData(row - offset + 3, col - offset + 3, 1, 1);
    const [r, g, b] = imgData.data;
    console.log("Color is ", colorDataToHex(r ?? 0, g ?? 0, b ?? 0));
    // Picks color from canvas and fills in the rectangle with that color
    context.fillStyle = colorDataToHex(r ?? 0, g ?? 0, b ?? 0);
    context.fillRect(row - offset, col - offset, cellSize, cellSize);
    drawGrid(canvas);
}
exports.removeStar = removeStar;
/**
 * Convert RGB Value to corresponding hex string
 *
 * @param r red value [0, 255]
 * @param g green value [0, 255]
 * @param b blue value [0, 255]
 */
function colorDataToHex(r, g, b) {
    const redHex = r.toString(16);
    const greenHex = g.toString(16);
    const blueHex = b.toString(16);
    const hexArr = [redHex, greenHex, blueHex];
    const newArr = hexArr.map((hex) => hex.length == 1 ? "0" + hex : hex);
    return '#' + newArr.join('');
}
/**
 * Given a cell which is the intersection of row and col, we will put a point as a placeholder in that cell.
 * This happens when the client wants to mark that cell as an empty cell.
 * @param canvas canvas to draw on
 * @param row, row of the board
 * @param col, col of the board
 * @param row
 * @param col
 * @param row
 * @param col
 */
function drawPoint(canvas, row, col) {
    const context = canvas.getContext('2d');
    (0, assert_1.default)(context, 'unable to get canvas drawing context');
    // save original context settings before we translate and change colors
    context.save();
    const circleAngle = 2 * Math.PI;
    // translate the coordinate system of the drawing context:
    //   the origin of `context` will now be (x,y)
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    const radius = 4;
    context.beginPath();
    // define circle path
    context.beginPath();
    context.arc(row, col, radius, 0, circleAngle);
    context.closePath();
    context.stroke();
    context.fillStyle = 'black';
    context.fill();
}
exports.drawPoint = drawPoint;
/**
 * @param canvas: canvas to draw on
 * Draws the gridlines on the canvas
 * @param canvas
 */
function drawGrid(canvas) {
    const context = canvas.getContext('2d');
    (0, assert_1.default)(context, 'unable to get canvas drawing context');
    // draw limes Such that canvas is 10x10
    const cellsPerRow = 10;
    const gridSpacing = canvas.width / cellsPerRow;
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.beginPath();
    for (let i = 1; i < cellsPerRow; i++) {
        // Vertical Lines
        context.moveTo(i * gridSpacing, 0);
        context.lineTo(i * gridSpacing, canvas.height);
        // Horizontal Lines
        context.moveTo(0, i * gridSpacing);
        context.lineTo(canvas.width, i * gridSpacing);
        context.stroke();
    }
}
exports.drawGrid = drawGrid;
/**
 * Given a set of cells that belong to a contiguous region, highlight the border of that region
 * @param canvas, canvas to draw on
 * @param region, set of cells identified by its coordinates.
 * @param canvas
 * @param region
 * @param color
 * @param canvas
 * @param region
 * @param color
 * @param canvas
 * @param region
 * @param color
 */
function highlightRegion(canvas, region, color) {
    const cellSize = canvas.height / numCells;
    const context = canvas.getContext('2d');
    (0, assert_1.default)(context, 'unable to get canvas drawing context');
    context.fillStyle = color;
    for (const r of region.getCells()) {
        const cellRow = r.getRow() * cellSize - cellSize;
        const cellCol = r.getColumn() * cellSize - cellSize;
        context.fillRect(cellRow, cellCol, cellSize, cellSize);
    }
}
/**
 * @param c: query cell
 * @param c
 * @returns a list of cell neighbors adjacent to the query cell
 */
function getNeighbors(c) {
    const lowerBound = 1;
    const upperBound = 10;
    const neighbors = [];
    if (c.getColumn() > lowerBound) {
        neighbors.push(new Puzzle_1.Cell(c.getRow(), c.getColumn() - 1, Puzzle_1.Mark.Empty));
    }
    if (c.getColumn() < upperBound) {
        neighbors.push(new Puzzle_1.Cell(c.getRow(), c.getColumn() + 1, Puzzle_1.Mark.Empty));
    }
    if (c.getRow() > lowerBound) {
        neighbors.push(new Puzzle_1.Cell(c.getRow() - 1, c.getColumn(), Puzzle_1.Mark.Empty));
    }
    if (c.getRow() < upperBound) {
        neighbors.push(new Puzzle_1.Cell(c.getRow() + 1, c.getColumn(), Puzzle_1.Mark.Empty));
    }
    return neighbors;
}
/**
 * Print a message by appending it to an HTML element.
 *
 * @param outputArea HTML element that should display the message
 * @param message message to display
 */
function printOutput(outputArea, message) {
    // append the message to the output area
    outputArea.innerText = message + '\n';
    // scroll the output area so that what we just printed is visible
    outputArea.scrollTop = outputArea.scrollHeight;
}
exports.printOutput = printOutput;
/**
 * @param value: number to be centered
 * @param value
 * @returns value on board such that it is centered in a grid cell
 */
function center(value) {
    const cellWidth = canvas_size / numCells;
    return Math.floor(value / cellWidth) * cellWidth + (cellWidth / 2);
}
exports.center = center;
/**
 * Colors in all regions of the Puzzle Board
 */
function colorAllRegions() {
    // Color in the regions
    const canvas = document.getElementById('canvas') ?? assert_1.default.fail('missing drawing canvas');
    for (const reg of puzzleADT.getRegions()) {
        const color = COLORS.shift();
        if (!color) {
            throw new Error('No more colors to add');
        }
        highlightRegion(canvas, reg, color);
    }
}
exports.colorAllRegions = colorAllRegions;
//# sourceMappingURL=drawingPrototype.js.map