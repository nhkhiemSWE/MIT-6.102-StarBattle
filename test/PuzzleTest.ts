import assert from 'assert';
import {Puzzle, Region, Cell, makePuzzle, makeRegion, makeCell, Mark, PuzzleStatus} from '../src/Puzzle'; 

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
                            
const unsolvedPuzzle = makePuzzle([region1, region2, region3, region4], PuzzleStatus.Unsolved);                          



/*
 * Tests for Puzzle
 * 
 */
describe('Puzzle ADT Tests', function() {

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
    it('Filler Test Case', function(){
        assert(true);
    });

    it('covers getRow() row = 1', function () {
        const rows = unsolvedPuzzle.getRow(1);

        assert.strictEqual(rows.length, 6);
        rows.forEach(cell => {
            assert.strictEqual(cell.getRow(), 1);
        })
    });

    it('covers getRow() 1 < row < 10', function () {
        const rows = unsolvedPuzzle.getRow(3);

        assert.strictEqual(rows.length, 6);
        rows.forEach(cell => {
            assert.strictEqual(cell.getRow(), 3);
        })
    });

    it('covers getRow() row = 10', function () {
        const rows = unsolvedPuzzle.getRow(6);

        assert.strictEqual(rows.length, 6);
        rows.forEach(cell => {
            assert.strictEqual(cell.getRow(), 6);
        })
    })

    it('covers getColumn() column = 1', function () {
        const columns = unsolvedPuzzle.getColumn(1);

        assert.strictEqual(columns.length, 6);
        columns.forEach(cell => {
            assert.strictEqual(cell.getColumn(), 1);
        })
    });

    it('covers getColumn() 1 < column < 10', function () { // <= should be upto 6 only 
        const columns = unsolvedPuzzle.getColumn(3);

        assert.strictEqual(columns.length, 6);
        columns.forEach(cell => {
            assert.strictEqual(cell.getColumn(), 3);
        })
    });

    it('covers getColumn() column = 10', function () {
        const columns = unsolvedPuzzle.getColumn(6);

        assert.strictEqual(columns.length, 6);
        columns.forEach(cell => {
            assert.strictEqual(cell.getColumn(), 6);
        })
    });

    it('covers adding a star to a starred cell', function () {
        const puzzle1 = unsolvedPuzzle.addStar(1, 1);
        const starCell1 = puzzle1.getRow(1).filter(cell => cell.getColumn() === 1);
        assert(starCell1[0]?.getMark() === Mark.Star);

        const puzzle2 = puzzle1.addStar(1, 1);
        const starCell2 = puzzle2.getRow(1).filter(cell => cell.getColumn() === 1);
        assert(starCell2[0]?.getMark() === Mark.Star);
    });

    it('covers adding a star to a empty cell', function () {
        const puzzle1 = unsolvedPuzzle.addStar(1, 1);
        const starCell = puzzle1.getRow(1).filter(cell => cell.getColumn() === 1);
        assert(starCell[0]?.getMark() === Mark.Star);
    });

    it('covers removing a star from a starred cell', function () {
        const puzzle1 = unsolvedPuzzle.addStar(1, 1);
        const starCell1 = puzzle1.getRow(1).filter(cell => cell.getColumn() === 1);
        assert(starCell1[0]?.getMark() === Mark.Star);

        const puzzle2 = puzzle1.removeStar(1, 1);
        const starCell2 = puzzle2.getRow(1).filter(cell => cell.getColumn() === 1);
        assert(starCell2[0]?.getMark() === Mark.Empty);
    });

    it('covers removing a star from a empty cell', function () {
        const puzzle1 = unsolvedPuzzle.removeStar(1, 1);
        const starCell1 = puzzle1.getRow(1).filter(cell => cell.getColumn() === 1);
        assert(starCell1[0]?.getMark() === Mark.Empty);
    });

    it('covers checking a blank puzzle', function () {
        assert.strictEqual(unsolvedPuzzle.isSolved(), false);
    });

    it('covers checking a partially solved puzzle', function () {
        const puzzle1 = unsolvedPuzzle.addStar(1, 1);
        const starCell = puzzle1.getRow(1).filter(cell => cell.getColumn() === 1);
        assert(starCell[0]?.getMark() === Mark.Star);

        assert.strictEqual(unsolvedPuzzle.isSolved(), false);
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

        assert.strictEqual(puzzle8.isSolved(), true);
    });

});