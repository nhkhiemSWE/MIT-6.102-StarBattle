"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const Puzzle_1 = require("../src/Puzzle");
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
const unsolvedPuzzle = (0, Puzzle_1.makePuzzle)([region1, region2, region3, region4], Puzzle_1.PuzzleStatus.Unsolved);
/*
 * Tests for Puzzle
 *
 */
describe('Puzzle ADT Tests', function () {
    /**
     * Testing Strategy for Puzzle
     *
     * getRegions():
     *
     *
     * getRow():
     *      // partition on row number: 1, 1 < row < 10, 10
     *
     *
     * getColumn():
     *      // partition on column number: 1, 1 < column < 10, 10
     *
     *
     * addStar():
     *      // partition on mark of cell: empty, star
     *
     *
     * removeStar():
     *      // partition on mark of cell: empty, star
     *
     *
     * isSolved():
     *      // partition on status: blank puzzle, partially solved, completely solved
     *
     */
    it('Filler Test Case', function () {
        (0, assert_1.default)(true);
    });
    it('covers getRow() row = 1', function () {
        const rows = unsolvedPuzzle.getRow(1);
        assert_1.default.strictEqual(rows.length, 6);
        rows.forEach(cell => {
            assert_1.default.strictEqual(cell.getRow(), 1);
        });
    });
    it('covers getRow() 1 < row < 10', function () {
        const rows = unsolvedPuzzle.getRow(3);
        assert_1.default.strictEqual(rows.length, 6);
        rows.forEach(cell => {
            assert_1.default.strictEqual(cell.getRow(), 3);
        });
    });
    it('covers getRow() row = 10', function () {
        const rows = unsolvedPuzzle.getRow(6);
        assert_1.default.strictEqual(rows.length, 6);
        rows.forEach(cell => {
            assert_1.default.strictEqual(cell.getRow(), 6);
        });
    });
    it('covers getColumn() column = 1', function () {
        const columns = unsolvedPuzzle.getColumn(1);
        assert_1.default.strictEqual(columns.length, 6);
        columns.forEach(cell => {
            assert_1.default.strictEqual(cell.getColumn(), 1);
        });
    });
    it('covers getColumn() 1 < column < 10', function () {
        const columns = unsolvedPuzzle.getColumn(3);
        assert_1.default.strictEqual(columns.length, 6);
        columns.forEach(cell => {
            assert_1.default.strictEqual(cell.getColumn(), 3);
        });
    });
    it('covers getColumn() column = 10', function () {
        const columns = unsolvedPuzzle.getColumn(6);
        assert_1.default.strictEqual(columns.length, 6);
        columns.forEach(cell => {
            assert_1.default.strictEqual(cell.getColumn(), 6);
        });
    });
    it('covers adding a star to a starred cell', function () {
        const puzzle1 = unsolvedPuzzle.addStar(1, 1);
        const starCell1 = puzzle1.getRow(1).filter(cell => cell.getColumn() === 1);
        (0, assert_1.default)(starCell1[0]?.getMark() === Puzzle_1.Mark.Star);
        const puzzle2 = puzzle1.addStar(1, 1);
        const starCell2 = puzzle2.getRow(1).filter(cell => cell.getColumn() === 1);
        (0, assert_1.default)(starCell2[0]?.getMark() === Puzzle_1.Mark.Star);
    });
    it('covers adding a star to a empty cell', function () {
        const puzzle1 = unsolvedPuzzle.addStar(1, 1);
        const starCell = puzzle1.getRow(1).filter(cell => cell.getColumn() === 1);
        (0, assert_1.default)(starCell[0]?.getMark() === Puzzle_1.Mark.Star);
    });
    it('covers removing a star from a starred cell', function () {
        const puzzle1 = unsolvedPuzzle.addStar(1, 1);
        const starCell1 = puzzle1.getRow(1).filter(cell => cell.getColumn() === 1);
        (0, assert_1.default)(starCell1[0]?.getMark() === Puzzle_1.Mark.Star);
        const puzzle2 = puzzle1.removeStar(1, 1);
        const starCell2 = puzzle2.getRow(1).filter(cell => cell.getColumn() === 1);
        (0, assert_1.default)(starCell2[0]?.getMark() === Puzzle_1.Mark.Empty);
    });
    it('covers removing a star from a empty cell', function () {
        const puzzle1 = unsolvedPuzzle.removeStar(1, 1);
        const starCell1 = puzzle1.getRow(1).filter(cell => cell.getColumn() === 1);
        (0, assert_1.default)(starCell1[0]?.getMark() === Puzzle_1.Mark.Empty);
    });
    it('covers checking a blank puzzle', function () {
        assert_1.default.strictEqual(unsolvedPuzzle.isSolved(), false);
    });
    it('covers checking a partially solved puzzle', function () {
        const puzzle1 = unsolvedPuzzle.addStar(1, 1);
        const starCell = puzzle1.getRow(1).filter(cell => cell.getColumn() === 1);
        (0, assert_1.default)(starCell[0]?.getMark() === Puzzle_1.Mark.Star);
        assert_1.default.strictEqual(unsolvedPuzzle.isSolved(), false);
    });
    it.skip('covers checking a solved puzzle', function () {
        // region 1 stars
        const puzzle1 = unsolvedPuzzle.addStar(1, 2);
        const puzzle2 = puzzle1.addStar(3, 2);
        console.log('PUZZLE', puzzle2.toString());
        // region 2 stars
        const puzzle3 = puzzle2.addStar(2, 4);
        const puzzle4 = puzzle3.addStar(2, 6);
        // region 3 stars
        const puzzle5 = puzzle4.addStar(5, 1);
        const puzzle6 = puzzle5.addStar(5, 3);
        // region 4 stars
        const puzzle7 = puzzle6.addStar(4, 5);
        const puzzle8 = puzzle7.addStar(6, 5);
        assert_1.default.strictEqual(puzzle8.isSolved(), true);
    });
});
//# sourceMappingURL=PuzzleTest.js.map