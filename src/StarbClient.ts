/* Copyright (c) 2021-23 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

// This code is loaded into starb-client.html, see the `npm compile` and
//   `npm watchify-client` scripts.
// Remember that you will *not* be able to use Node APIs like `fs` in the web browser.

import assert from 'assert';
import fetch from 'node-fetch';
import { Cell, Region, Puzzle, PuzzleStatus, Mark, makePuzzle } from './Puzzle';
import {center, drawPoint, drawStar, printOutput, drawGrid, removeStar, colorAllRegions} from './drawingPrototype';
import { solvedPuzzleParser, emptyPuzzleParser} from './Parser';
import {Client} from './clientADT';

const BOX_SIZE = 16;

// categorical colors from
// https://github.com/d3/d3-scale-chromatic/tree/v2.0.0#schemeCategory10
const COLORS: Array<string> = [
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
async function main(): Promise<void> {
    // fetch the puzzle
    const puzzleName = 'kd-1-1-1';

    const res = await fetch(`http://localhost:8789/puzzles/${puzzleName}`);
    const puzzleData = await res.text();
    const puzzle: Puzzle = emptyPuzzleParser(puzzleData);
    const client: Client = new Client(puzzle);

    // output area for printing
    const outputArea: HTMLElement = document.getElementById('outputArea') ?? assert.fail('missing output area');
    // canvas for drawing
    const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement ?? assert.fail('missing drawing canvas');
     // Change W,H to be divisible by 10
    canvas.height = 250; canvas.width = 250;

    // Color in Regions
    colorAllRegions();
    // draw grid lines over the colors
    drawGrid(canvas);

    // button for checking if solved
    const button: HTMLButtonElement = document.getElementById('checkButton') as HTMLButtonElement ?? assert.fail('missing check button');

    // when the user clicks on the drawing canvas...
    button.addEventListener('click', (event: MouseEvent) => {
        const isSolved = client.getPuzzle().isSolved();
        const message = isSolved ? 'The puzzle is solved' : 'The puzzle is not solved';
        printOutput(outputArea, message);
    });

    // when the user clicks on the drawing canvas...
    canvas.addEventListener('click', (event: MouseEvent) => {
        const divisor = 25;
        const initialAdd = 12.5;
        const [row, col] = [(center(event.offsetY)+initialAdd)/divisor, (center(event.offsetX)+initialAdd)/divisor];

        // check if there is a star at the coordinate
        if (client.getPuzzle().getCell(row, col).getMark() === 1) {
            client.addStar(row, col);
            drawStar(canvas, center(event.offsetX), center(event.offsetY));
        } else {
            client.removeStar(row, col);
            removeStar(canvas, center(event.offsetX), center(event.offsetY));
        }


        // drawStar(canvas, center(event.offsetX), center(event.offsetY));
        //drawPoint(canvas, center(event.offsetX), center(event.offsetY));
        //removeStar(canvas, center(event.offsetX), center(event.offsetY));
    });
    // add initial instructions to the output area
    printOutput(outputArea, `Fill some cells with stars so that
    each row, column, and bold region contains the indicated number of stars.\n Stars cannot be placed in adjacent cells that share an edge or corner.`);
   
}

main();