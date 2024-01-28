import assert from 'assert';
import {Client} from '../src/clientADT'
import {Cell, Region, Puzzle, Mark, PuzzleStatus} from '../src/Puzzle'
import { emptyPuzzleParser, solvedPuzzleParser } from '../src/Parser';

describe('Client ADT Tests', function() {
    // Testing Strategy
    //  - toString
    //      - partition on empty Puzzle / in Progress Puzzle / solved Puzzle / incorrectly partitially solved
    //      - partition on violation : 2 cells are adjacent, more than 2 cells in a col, more than 2 cells in a row, more than 2 cells in a region
    //  - getStatus
    //      - partition on empty Puzzle / in Progress Puzzle / solved Puzzle / incorrectly partitially solved
    //  - addStar
    //      - partition on number of star: 0, 1, >1
    //      - partition on is a Star already in the cell: true, false
    //      - partition on violation : 2 cells are adjacent, more than 2 cells in a col, more than 2 cells in a row, more than 2 cells in a region
    //  - removeStar
    //      - partition on number of star: 0, 1, >1
    //      - partition on is a Star already in the cell: true, false
    //  - getPuzzle  
    //      - partition on puzzle existing
    //  - refresh 
    //      - partition on empty Puzzle / in Progress Puzzle / solved Puzzle / incorrectly partitially solved

    const solvedPuzzleString = `10x10
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
    const emptyPuzzleString = `10x10
    | 1,2 1,5 1,1 1,3 1,4 1,6 1,7 1,8 2,1 2,2 2,3 2,4 2,5 2,6 2,8 3,5
    | 2,9 4,10 1,9 1,10 2,10 3,9 3,10 4,9 5,9 5,10 6,9 6,10 7,10 8,10
    | 3,2 3,4 3,3
    | 2,7 4,8 3,6 3,7 3,8
    | 6,1 9,1 3,1 4,1 4,2 4,3 4,4 5,1 5,2 5,3 6,2 7,1 7,2 8,1 8,2 8,3 8,4 8,5 8,6
    | 5,4 5,6 4,5 5,5 6,4 6,5 6,6
    | 6,8 8,7 4,6 4,7 5,7 5,8 6,7 7,6 7,7 7,8 8,8
    | 7,3 7,5 6,3 7,4 
    | 8,9 10,10 7,9 9,9 9,10
    | 9,3 10,6 9,2 9,4 9,5 9,6 9,7 9,8 10,1 10,2 10,3 10,4 10,5 10,7 10,8 10,9
    `;
    
    const solve = (client : Client) => {
        for (const string of solvedPuzzleString.split('\n').splice(1)) {
            const regex = /[0-9]+,[0-9]+/g;
            const solutions = string.split('|')[0];
            for (const sol of solutions?.match(regex) ?? []) {
                const pos = sol.split(',').map((ele) => parseInt(ele));
                client.addStar(pos[0] ?? 0, pos[1] ?? 0);
            }
        }
    }
    const getStars = (puzzleString : string) => {
        const result = new Set();
        for (const string of puzzleString.split('\n').splice(1)) {
            const regex = /[0-9]+,[0-9]+/g;
            const stars = string.split('|')[0];
            for (const star of stars?.match(regex) ?? []) {
                result.add(star.split(',').map((ele) => parseInt(ele)));
            }
        }
        return result;
    }
    const getRegions = (puzzleString : string) => {
        const result = new Set();
        for (const string of puzzleString.split('\n').splice(1)) {
            const regex = /[0-9]+,[0-9]+/g; 
            const region = new Set();
            for (const cell of string?.match(regex) ?? []) {
                region.add(cell.split(',').map((ele) => parseInt(ele)));
            }
            result.add(region);
        }
        return result;
    }
    // Combination tests
    it('toString + getStatus, empty Puzzle', function(){
        const emptyPuzzle = emptyPuzzleParser(emptyPuzzleString);
        const client = new Client(emptyPuzzle);
        assert.deepStrictEqual(getStars(client.toString()), new Set(), "no star has been placed yet");
        assert.deepStrictEqual(getRegions(client.toString()), getRegions(emptyPuzzleString), "regions must be the same");
        assert(!client.getStatus(), "the puzzle is unsolved");
    });
    it('toString + getStatus + addStar, partitially solved Puzzle', function(){
        const emptyPuzzle = emptyPuzzleParser(emptyPuzzleString);
        const client = new Client(emptyPuzzle);
        client.addStar(1,2);
        assert.deepStrictEqual(getStars(client.toString()), new Set().add([1,2]), "incorrect stars after adding");
        assert.deepStrictEqual(getRegions(client.toString()), getRegions(emptyPuzzleString), "regions must be the same");
        assert(!client.getStatus(), "the puzzle is unsolved");
    });   
    it('toString + getStatus + addStar, correctly solved Puzzle', function(){
        const emptyPuzzle = emptyPuzzleParser(emptyPuzzleString);
        const client = new Client(emptyPuzzle);
        solve(client);
        assert.deepStrictEqual(getRegions(client.toString()), getRegions(emptyPuzzleString), "regions must be the same");
        assert.deepStrictEqual(getStars(client.toString()), getStars(solvedPuzzleString), "incorrect stars after adding");
        assert(client.getStatus(), "the puzzle is solved correctly"); 
    });
    it('toString + getStatus + addStar, partitially but incorrectly solved Puzzle, cells are adjacent', function(){
        const emptyPuzzle = emptyPuzzleParser(emptyPuzzleString);
        const client = new Client(emptyPuzzle);
        client.addStar(1,1); 
        client.addStar(1,2);
        assert.deepStrictEqual(getStars(client.toString()), new Set([[1,1], [1,2]]), "incorrect stars after adding");
        assert.deepStrictEqual(getRegions(client.toString()), getRegions(emptyPuzzleString), "regions must be the same");
        assert(!client.getStatus(), "the puzzle is unsolved");
    });
    it('toString + getStatus + addStar, partitially but incorrectly solved Puzzle, 3 cells in a row', function(){
        const emptyPuzzle = emptyPuzzleParser(emptyPuzzleString);
        const client = new Client(emptyPuzzle);
        client.addStar(1,1); 
        client.addStar(1,3); 
        client.addStar(1,5); 
        assert.deepStrictEqual(getStars(client.toString()), new Set([[1,1], [1,3], [1,5]]), "incorrect stars after adding");
        assert.deepStrictEqual(getRegions(client.toString()), getRegions(emptyPuzzleString), "regions must be the same");
        assert(!client.getStatus(), "the puzzle is unsolved");
    });
    it('toString + getStatus + addStar, partitially but incorrectly solved Puzzle, 3 cells in a col', function(){
        const emptyPuzzle = emptyPuzzleParser(emptyPuzzleString);
        const client = new Client(emptyPuzzle);
        client.addStar(1,1); 
        client.addStar(3,1); 
        client.addStar(5,1); 
        assert.deepStrictEqual(getStars(client.toString()), new Set([[1,1], [3,1], [5,1]]), "incorrect stars after adding");
        assert.deepStrictEqual(getRegions(client.toString()), getRegions(emptyPuzzleString), "regions must be the same");
        assert(!client.getStatus(), "the puzzle is unsolved");
    });
    it('toString + getStatus + addStar, partitially but incorrectly solved Puzzle, 3 cells in a region', function(){
        const emptyPuzzle = emptyPuzzleParser(emptyPuzzleString);
        const client = new Client(emptyPuzzle);
        client.addStar(2,7); 
        client.addStar(4,8); 
        client.addStar(3,6); 
        assert.deepStrictEqual(getStars(client.toString()), new Set([[2,7], [3,6], [4,8]]), "incorrect stars after adding");
        assert.deepStrictEqual(getRegions(client.toString()), getRegions(emptyPuzzleString), "regions must be the same");
        assert(!client.getStatus(), "the puzzle is unsolved");
    });
    it('toString + getStatus + addStar, partitially but incorrectly solved Puzzle, the whole puzzle fills with stars', function(){
        const emptyPuzzle = emptyPuzzleParser(emptyPuzzleString);
        const client = new Client(emptyPuzzle);
        const expectedSet = new Set();
        for (let row = 1; row <11; row ++) {
            for (let col =1; col <11; col ++) {
                client.addStar(row, col);
                expectedSet.add([row,col]);
            }
        }
        assert.deepStrictEqual(getStars(client.toString()), expectedSet, "incorrect stars");
        assert.deepStrictEqual(getRegions(client.toString()), getRegions(emptyPuzzleString), "regions must be the same");
        assert(!client.getStatus(), "the puzzle is unsolved");
    });

    // Test addStar()
    it('addStar, add a star twice to a position', function(){
        const emptyPuzzle = emptyPuzzleParser(emptyPuzzleString);
        const client = new Client(emptyPuzzle);
        client.addStar(1,2);
        client.addStar(1,2);
        assert.deepStrictEqual(getStars(client.toString()),new Set().add([1,2]), "incorrect stars");
        assert.deepStrictEqual(getRegions(client.toString()), getRegions(emptyPuzzleString), "regions must be the same");
        assert(!client.getStatus(), "the puzzle is unsolved");
    });

    // Test removeStar()
    it('removeStar, remove a star from an empty position', function(){
        const emptyPuzzle = emptyPuzzleParser(emptyPuzzleString);
        const client = new Client(emptyPuzzle);
        client.addStar(1,2);
        client.removeStar(1,3);
        assert.deepStrictEqual(getStars(client.toString()),new Set().add([1,2]), "incorrect stars");
        assert.deepStrictEqual(getRegions(client.toString()), getRegions(emptyPuzzleString), "regions must be the same");
        assert(!client.getStatus(), "the puzzle is unsolved");
    });
    it('removeStar, remove two stars', function(){
        const emptyPuzzle = emptyPuzzleParser(emptyPuzzleString);
        const client = new Client(emptyPuzzle);
        client.addStar(1,4);
        client.addStar(1,3);
        client.addStar(1,2);
        client.removeStar(1,3);
        client.removeStar(1,4);
        assert.deepStrictEqual(getStars(client.toString()),new Set().add([1,2]), "incorrect stars");
        assert.deepStrictEqual(getRegions(client.toString()), getRegions(emptyPuzzleString), "regions must be the same");
        assert(!client.getStatus(), "the puzzle is unsolved");
    });

    // Test refresh()
    it('refresh, empty puzzle', function(){
        const emptyPuzzle = emptyPuzzleParser(emptyPuzzleString);
        const client = new Client(emptyPuzzle);
        client.refresh();
        assert.deepStrictEqual(getStars(client.toString()),new Set(), "incorrect stars");
        assert.deepStrictEqual(getRegions(client.toString()), getRegions(emptyPuzzleString), "regions must be the same");
        assert(!client.getStatus(), "the puzzle is unsolved");
    });
    it('refresh, partitially solved puzzle', function(){
        const emptyPuzzle = emptyPuzzleParser(emptyPuzzleString);
        const client = new Client(emptyPuzzle);
        client.addStar(1,2);
        client.addStar(1,5);
        client.refresh();
        assert.deepStrictEqual(getStars(client.toString()),new Set(), "incorrect stars");
        assert.deepStrictEqual(getRegions(client.toString()), getRegions(emptyPuzzleString), "regions must be the same");
        assert(!client.getStatus(), "the puzzle is unsolved");
    });
    it('refresh, correctly solved puzzle', function(){
        const emptyPuzzle = emptyPuzzleParser(emptyPuzzleString);
        const client = new Client(emptyPuzzle);
        solve(client);
        client.refresh();
        assert.deepStrictEqual(getStars(client.toString()),new Set(), "incorrect stars");
        assert.deepStrictEqual(getRegions(client.toString()), getRegions(emptyPuzzleString), "regions must be the same");
        assert(!client.getStatus(), "the puzzle is unsolved");
    });
    it('refresh, the whole puzzle fills with stars', function(){
        const emptyPuzzle = emptyPuzzleParser(emptyPuzzleString);
        const client = new Client(emptyPuzzle);
        for (let row = 1; row <11; row ++) {
            for (let col =1; col <11; col ++) {
                client.addStar(row, col);
            }
        }
        client.refresh();
        assert.deepStrictEqual(getStars(client.toString()),new Set(), "incorrect stars");
        assert.deepStrictEqual(getRegions(client.toString()), getRegions(emptyPuzzleString), "regions must be the same");
        assert(!client.getStatus(), "the puzzle is unsolved");
    });
});

