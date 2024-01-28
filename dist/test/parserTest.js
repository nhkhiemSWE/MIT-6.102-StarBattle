"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const Parser_1 = require("../src/Parser");
const Puzzle_1 = require("../src/Puzzle");
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
function makePuzzl(puzzleString) {
    const result = new Array();
    for (const string of puzzleString.split('\n').splice(1)) {
        const regex = /[0-9]+,[0-9]+/g;
        const region = new Array();
        for (const cell of string?.match(regex) ?? []) {
            const cells = cell.split(',').map((ele) => parseInt(ele));
            region.push((0, Puzzle_1.makeCell)(cells[0] ?? 0, cells[1] ?? 0, Puzzle_1.Mark.Empty));
        }
        if (region.length) {
            result.push((0, Puzzle_1.makeRegion)(region));
        }
    }
    console.log(result);
    return new Puzzle_1.Puzzle(result, Puzzle_1.PuzzleStatus.Unsolved);
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
const region1 = (0, Puzzle_1.makeRegion)([(0, Puzzle_1.makeCell)(1, 1, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(1, 2, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(1, 3, Puzzle_1.Mark.Empty),
    (0, Puzzle_1.makeCell)(2, 1, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(2, 2, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(2, 3, Puzzle_1.Mark.Empty),
    (0, Puzzle_1.makeCell)(3, 1, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(3, 2, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(3, 3, Puzzle_1.Mark.Empty)]);
const region2 = (0, Puzzle_1.makeRegion)([(0, Puzzle_1.makeCell)(1, 4, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(1, 5, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(1, 6, Puzzle_1.Mark.Empty),
    (0, Puzzle_1.makeCell)(2, 4, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(2, 5, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(2, 6, Puzzle_1.Mark.Empty),
    (0, Puzzle_1.makeCell)(3, 4, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(3, 5, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(3, 6, Puzzle_1.Mark.Empty)]);
const region3 = (0, Puzzle_1.makeRegion)([(0, Puzzle_1.makeCell)(4, 1, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(4, 2, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(4, 3, Puzzle_1.Mark.Empty),
    (0, Puzzle_1.makeCell)(5, 1, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(5, 2, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(5, 3, Puzzle_1.Mark.Empty),
    (0, Puzzle_1.makeCell)(6, 1, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(6, 2, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(6, 3, Puzzle_1.Mark.Empty)]);
const region4 = (0, Puzzle_1.makeRegion)([(0, Puzzle_1.makeCell)(4, 4, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(4, 5, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(4, 6, Puzzle_1.Mark.Empty),
    (0, Puzzle_1.makeCell)(5, 4, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(5, 5, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(5, 6, Puzzle_1.Mark.Empty),
    (0, Puzzle_1.makeCell)(6, 4, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(6, 5, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(6, 6, Puzzle_1.Mark.Empty)]);
const expectedPuzzle = (0, Puzzle_1.makePuzzle)([region1, region2, region3, region4], Puzzle_1.PuzzleStatus.Unsolved);
describe('parser', function () {
    // Testing strategy:
    //
    //      - Partition on number of comments  : 0 line, 1 line, >1 line
    //      - Partition on shape of the puzzle : square, rectangular
    //      - Partition on size of the puzzle  : 1x1 size, nxn size (n > 10, to test non-single digit dimension)
    //      - Partition on number of regions   : 1, >1
    //      - Partition on types of puzzle     : solved, empty
    it('More than 1 comments + big (>9) dimensions + square shape + solved Puzzle', function () {
        const puzzle = (0, Parser_1.solvedPuzzleParser)(solvedPuzzleString);
        (0, assert_1.default)(puzzle.equalValue(oriPuzzle), "should produce the same puzzle");
        (0, assert_1.default)(!puzzle.isSolved(), "expected the puzzle to be empty");
    });
    it('1 comment + empty Puzzle', function () {
        const puzzle = (0, Parser_1.emptyPuzzleParser)(emptyPuzzleString);
        (0, assert_1.default)(puzzle.equalValue(oriPuzzle), "should produce the same puzzle");
        (0, assert_1.default)(!puzzle.isSolved(), "expected the puzzle to be unsolved");
    });
    it('0 comment + rectangle Puzzle + small size + 1 region', function () {
        const puzzle = (0, Parser_1.emptyPuzzleParser)(rectanglePuzzle);
        assert_1.default.deepStrictEqual(puzzle.getRegions(), [(0, Puzzle_1.makeRegion)([(0, Puzzle_1.makeCell)(1, 2, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(1, 1, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(1, 3, Puzzle_1.Mark.Empty)])], "should produce the same string as does the expected puzzle");
        (0, assert_1.default)(!puzzle.isSolved(), "expected the puzzle to be unsolved");
        const cells = [(0, Puzzle_1.makeCell)(1, 1, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(1, 2, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(1, 3, Puzzle_1.Mark.Empty)];
        assert_1.default.deepStrictEqual(new Set(puzzle.getRow(1)), new Set(cells), "expected the correct array of cells");
    });
    it('test using Puzzle.toEqual()', function () {
        const puzzle = (0, Parser_1.emptyPuzzleParser)(smallPuzzle);
        (0, assert_1.default)(puzzle.equalValue(expectedPuzzle), "expected the same puzzle");
        (0, assert_1.default)(!puzzle.isSolved(), "expected the puzzle to be unsolved");
        const cells = [(0, Puzzle_1.makeCell)(1, 1, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(1, 2, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(1, 3, Puzzle_1.Mark.Empty),
            (0, Puzzle_1.makeCell)(1, 4, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(1, 5, Puzzle_1.Mark.Empty), (0, Puzzle_1.makeCell)(1, 6, Puzzle_1.Mark.Empty)];
        assert_1.default.deepStrictEqual(puzzle.getRow(1), cells, "expected the correct array of cells");
    });
});
//# sourceMappingURL=parserTest.js.map