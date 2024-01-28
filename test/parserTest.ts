import assert from 'assert';
import { emptyPuzzleParser, solvedPuzzleParser } from '../src/Parser';
import {Puzzle, Region, Cell, makePuzzle, makeRegion, makeCell, Mark, PuzzleStatus} from '../src/Puzzle'; 
const solvedPuzzleString = `# This is an solved Puzzle
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
const emptyPuzzleString = `# This is an empty Puzzle
    10x10
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
function makePuzzl  (puzzleString : string) : Puzzle {
    const result = new Array();
    for (const string of puzzleString.split('\n').splice(1)) {
        const regex = /[0-9]+,[0-9]+/g; 
        const region = new Array();
        for (const cell of string?.match(regex) ?? []) {
            const cells = cell.split(',').map((ele) => parseInt(ele))
            region.push(makeCell(cells[0]??0, cells[1]??0, Mark.Empty));
        }
        if (region.length) {
            result.push(makeRegion(region));
        }
    }
    return new Puzzle(result, PuzzleStatus.Unsolved);
}
const oriPuzzle = makePuzzl(emptyPuzzleString);
const rectanglePuzzle = `1x3
    | 1,2 1,1 1,3
    `;
const smallPuzzle = `# Some comments on the top
    6x6
    | 1,1 1,2 1,3 2,1 2,2 2,3 3,1 3,2 3,3
    | 4,1 4,2 4,3 5,1 5,2 5,3 6,1 6,2 6,3
    | 1,4 1,5 1,6 2,4 2,5 2,6 3,4 3,5 3,6
    | 4,4 4,5 4,6 5,4 5,5 5,6 6,4 6,5 6,6
`;
const region1 = makeRegion([makeCell(1, 1, Mark.Empty), makeCell(1, 2, Mark.Empty), makeCell(1, 3, Mark.Empty), 
    makeCell(2, 1, Mark.Empty), makeCell(2, 2, Mark.Empty), makeCell(2, 3, Mark.Empty),
    makeCell(3, 1, Mark.Empty), makeCell(3, 2, Mark.Empty), makeCell(3, 3, Mark.Empty)]);

const region2 = makeRegion([makeCell(1, 4, Mark.Empty), makeCell(1, 5, Mark.Empty), makeCell(1, 6, Mark.Empty), 
    makeCell(2, 4, Mark.Empty), makeCell(2, 5, Mark.Empty), makeCell(2, 6, Mark.Empty),
    makeCell(3, 4, Mark.Empty), makeCell(3, 5, Mark.Empty), makeCell(3, 6, Mark.Empty)]);

const region3 = makeRegion([makeCell(4, 1, Mark.Empty), makeCell(4, 2, Mark.Empty), makeCell(4, 3, Mark.Empty), 
    makeCell(5, 1, Mark.Empty), makeCell(5, 2, Mark.Empty), makeCell(5, 3, Mark.Empty),
    makeCell(6, 1, Mark.Empty), makeCell(6, 2, Mark.Empty), makeCell(6, 3, Mark.Empty)]);

const region4 = makeRegion([makeCell(4, 4, Mark.Empty), makeCell(4, 5, Mark.Empty), makeCell(4, 6, Mark.Empty), 
    makeCell(5, 4, Mark.Empty), makeCell(5, 5, Mark.Empty), makeCell(5, 6, Mark.Empty),
    makeCell(6, 4, Mark.Empty), makeCell(6, 5, Mark.Empty), makeCell(6, 6, Mark.Empty)]);      
    
const expectedPuzzle = makePuzzle([region1, region2, region3, region4], PuzzleStatus.Unsolved);         

describe('parser', function() {

    // Testing strategy:
    //
    //      - Partition on number of comments  : 0 line, 1 line, >1 line
    //      - Partition on shape of the puzzle : square, rectangular
    //      - Partition on size of the puzzle  : 1x1 size, nxn size (n > 10, to test non-single digit dimension)
    //      - Partition on number of regions   : 1, >1
    //      - Partition on types of puzzle     : solved, empty
    it('More than 1 comments + big (>9) dimensions + square shape + solved Puzzle', function(){
        const puzzle = solvedPuzzleParser(solvedPuzzleString);
        assert(puzzle.equalValue(oriPuzzle), "should produce the same puzzle");
        assert(!puzzle.isSolved(), "expected the puzzle to be empty");
    });
    it('1 comment + empty Puzzle', function(){
        const puzzle = emptyPuzzleParser(emptyPuzzleString);
        assert(puzzle.equalValue(oriPuzzle), "should produce the same puzzle");
        assert(!puzzle.isSolved(), "expected the puzzle to be unsolved");
    });
    it('0 comment + rectangle Puzzle + small size + 1 region', function(){
        const puzzle = emptyPuzzleParser(rectanglePuzzle);
        assert.deepStrictEqual(puzzle.getRegions(), [makeRegion([makeCell(1, 2, Mark.Empty), makeCell(1, 1, Mark.Empty), makeCell(1, 3, Mark.Empty)])],
                             "should produce the same string as does the expected puzzle");
        assert(!puzzle.isSolved(), "expected the puzzle to be unsolved");
        const cells = [makeCell(1, 1, Mark.Empty), makeCell(1, 2, Mark.Empty),makeCell(1, 3, Mark.Empty)];
        assert.deepStrictEqual(new Set(puzzle.getRow(1)), new Set(cells), "expected the correct array of cells");
    });
    it('test using Puzzle.toEqual()', function(){
        const puzzle = emptyPuzzleParser(smallPuzzle);
        assert(puzzle.equalValue(expectedPuzzle), "expected the same puzzle");
        assert(!puzzle.isSolved(), "expected the puzzle to be unsolved");
        const cells = [makeCell(1, 1, Mark.Empty), makeCell(1, 2, Mark.Empty),makeCell(1, 3, Mark.Empty), 
                       makeCell(1, 4, Mark.Empty), makeCell(1, 5, Mark.Empty), makeCell(1, 6, Mark.Empty)];
        assert.deepStrictEqual(puzzle.getRow(1), cells, "expected the correct array of cells");
    });
});