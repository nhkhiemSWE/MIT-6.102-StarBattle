"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePuzzle = exports.makeRegion = exports.makeCell = exports.Cell = exports.Region = exports.Puzzle = exports.Mark = exports.PuzzleStatus = void 0;
const assert_1 = __importDefault(require("assert"));
var PuzzleStatus;
(function (PuzzleStatus) {
    PuzzleStatus[PuzzleStatus["Unsolved"] = 0] = "Unsolved";
    PuzzleStatus[PuzzleStatus["FullySolved"] = 1] = "FullySolved";
})(PuzzleStatus = exports.PuzzleStatus || (exports.PuzzleStatus = {}));
var Mark;
(function (Mark) {
    Mark[Mark["Star"] = 0] = "Star";
    Mark[Mark["Empty"] = 1] = "Empty";
})(Mark = exports.Mark || (exports.Mark = {}));
class Puzzle {
    // Abstraction function:
    //   AF(puzzleRegions, input) = a 10x10 board filled with Mark.Unknown and that board is divided into 
    //                          the set of contiguous regions which mutually exclusive and collectively exhaustive the puzzle board
    //                          status == unsolved if every cell is Mark.Unknown, partially solve if there is some Mark.Unknown, and fully-solved if there is no Mark.Unknown
    //Rep invariant:
    //   1) each puzzleRegion must satisfy the RI of the Region class
    //   2) the regions must be mutually exclusive and collectively exhaustive the puzzle board
    //   3) every region, row, and column cannot contain more than two Mark.Star 
    // Safety from rep exposure:
    //   - all fields are private and readonly
    //   - puzzle is mutable number[][] and thus a defensive copy is made anytime a slice is returned from puzzle
    //     and in the constructor
    constructor(regions, status) {
        this.regions = [...regions];
        this.status = status;
        this.checkRep();
    }
    checkRep() {
        (0, assert_1.default)(true);
    }
    /**
     * Retrieves the regions of the puzzle
     *
     * @returns the regions of the puzzle
     */
    getRegions() {
        return this.regions;
    }
    /**
     * @param row desired row
     * @returns all the cells in row `row`
     */
    getRow(row) {
        return this.regions.reduce((rowCells, region) => rowCells.concat(region.getCells().filter(cell => cell.getRow() === row)), new Array);
    }
    /**
     * @param column desired column
     * @returns all the cells in column `column`
     */
    getColumn(column) {
        return this.regions.reduce((columnCells, region) => columnCells.concat(region.getCells().filter(cell => cell.getColumn() === column)), new Array);
    }
    /**
     * @param row row of cell
     * @param column column of cell
     * @returns the cell at row `row` and column `column`
     */
    getCell(row, column) {
        if (row < 1 || row > this.getRegions().length) {
            throw new Error;
        }
        const cell = this.getRow(row).filter(curCell => curCell.getColumn() === column)[0];
        return cell ?? makeCell(1, 1, Mark.Empty);
    }
    /**
     *
     * @param row row of the star
     * @param column column of the star
     * @returns a copy of the puzzle with a star placed at the cell with row `row` and column `column`
     */
    addStar(row, column) {
        const copyRegions = this.deepCopy([...this.regions]);
        const newRegions = [];
        copyRegions.forEach(region => newRegions.push(makeRegion(region.getCells().map(cell => {
            if (cell.getRow() === row && cell.getColumn() === column) {
                return makeCell(row, column, Mark.Star);
            }
            else {
                return cell;
            }
        }))));
        return makePuzzle(newRegions, this.status);
    }
    /**
     *
     * @param row row of the star to be removed
     * @param column column of the star to be removed
     * @returns a copy of the puzzle with a star removed at the cell with row `row` and column `column`
     */
    removeStar(row, column) {
        const copyRegions = this.deepCopy([...this.regions]);
        const newRegions = [];
        copyRegions.forEach(region => newRegions.push(makeRegion(region.getCells().map(cell => {
            if (cell.getRow() === row && cell.getColumn() === column) {
                return makeCell(row, column, Mark.Empty);
            }
            else {
                return cell;
            }
        }))));
        return makePuzzle(newRegions, this.status);
    }
    /**
     *
     * @returns true if the puzzle has been solved, false if not
     */
    isSolved() {
        const minDim = 1;
        const maxDim = this.getRegions().length;
        // check row condition
        for (let row = minDim; row <= maxDim; row++) {
            const curRow = this.getRow(row);
            let starCount = 0;
            for (const cell of curRow) {
                cell.getMark() === Mark.Star && starCount++;
            }
            if (starCount !== 2) {
                return false;
            }
        }
        // check column condition
        for (let column = minDim; column <= maxDim; column++) {
            const curColumn = this.getColumn(column);
            let starCount = 0;
            for (const cell of curColumn) {
                cell.getMark() === Mark.Star && starCount++;
            }
            if (starCount !== 2) {
                return false;
            }
        }
        // check region condition
        for (const region of this.getRegions()) {
            let starCount = 0;
            for (const cell of region.getCells()) {
                cell.getMark() === Mark.Star && starCount++;
            }
            if (starCount !== 2) {
                return false;
            }
        }
        // check neighbor condition
        for (const region of this.getRegions()) {
            for (const cell of region.getCells()) {
                for (const cell2 of this.getNeighbors(cell)) {
                    if (cell2.getMark() === Mark.Star && cell.getMark() === Mark.Star) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    /**
     * @param regions regions to be copied
     * @returns a deep copy of an array of regions
     */
    deepCopy(regions) {
        const newRegions = [];
        regions.forEach(region => {
            let newCells = [];
            region.getCells().forEach(cell => {
                const newCell = makeCell(cell.getRow(), cell.getColumn(), cell.getMark());
                newCells.push(newCell);
            });
            newRegions.push(makeRegion(newCells));
            newCells = [];
        });
        return newRegions;
    }
    /**
     * @param cell cell to check neighbors on
     * @returns an array of cells that are the neighboring cells of the given cell
     */
    getNeighbors(cell) {
        const aboveRow = this.getRow(cell.getRow() - 1).filter(cell2 => (cell2.getColumn() === cell.getColumn() - 1
            || cell2.getColumn() === cell.getColumn()
            || cell2.getColumn() === cell.getColumn() + 1));
        const curRow = this.getRow(cell.getRow()).filter(cell2 => (cell2.getColumn() === cell.getColumn() - 1
            || cell2.getColumn() === cell.getColumn() + 1));
        const belowRow = this.getRow(cell.getRow() + 1).filter(cell2 => (cell2.getColumn() === cell.getColumn() - 1
            || cell2.getColumn() === cell.getColumn()
            || cell2.getColumn() === cell.getColumn() + 1));
        return aboveRow.concat(curRow).concat(belowRow);
    }
    /**
     * @returns a string representation of the Puzzle
     */
    toString() {
        const regions = this.getRegions();
        const dim = regions.length;
        let puzzleStr = `${dim}x${dim}\n`;
        for (const region of regions) {
            // add stars first
            for (const cell of region.getCells()) {
                if (cell.getMark() === Mark.Star) {
                    puzzleStr += `${cell.toString()} `;
                }
            }
            // separate by pipe
            puzzleStr += '| ';
            // now add non-stars
            for (const cell of region.getCells()) {
                if (cell.getMark() !== Mark.Star) {
                    puzzleStr += `${cell.toString()} `;
                }
            }
            // add new line
            puzzleStr += '\n';
        }
        return puzzleStr;
    }
    /**
     * @param that any Puzzle
     * @returns true if and only if this and that have the same regions
     */
    equalValue(that) {
        // make sure lengths are equal
        if (this.regions.length !== that.regions.length) {
            return false;
        }
        for (const region1 of this.regions) {
            let foundMatch = false;
            for (const region2 of that.regions) {
                if (region1.equalValue(region2)) {
                    foundMatch = true;
                }
            }
            if (!foundMatch) {
                return false;
            }
        }
        for (const region1 of that.regions) {
            let foundMatch = false;
            for (const region2 of this.regions) {
                if (region1.equalValue(region2)) {
                    foundMatch = true;
                }
            }
            if (!foundMatch) {
                return false;
            }
        }
        return true;
    }
}
exports.Puzzle = Puzzle;
class Region {
    // Abstraction function
    //   AF[cells] = given a set of cells, create a continuous region. 
    // Rep Invariant: 
    //   1) Region must be contiguous
    // Safety from rep exposure:
    //   - all fields are private and readonly;
    constructor(cells) {
        this.cells = [...cells];
        this.checkRep();
    }
    checkRep() {
        // check for contiguousy
        (0, assert_1.default)(true);
    }
    /**
     * Retrieves the cells of the region
     *
     * @returns the cells of the region
     */
    getCells() {
        return this.cells;
    }
    /**
     * @returns a string representation of the region
     */
    toString() {
        let regionStr = '';
        this.cells.forEach(cell => {
            regionStr += `${cell.toString()} \n`;
        });
        return regionStr;
    }
    /**
     * @param that any Region
     * @returns true if and only if this and that have the same cells
     */
    equalValue(that) {
        // make sure lengths are equal
        if (this.cells.length !== that.cells.length) {
            return false;
        }
        // compare each cell 
        for (const cell1 of this.cells) {
            let foundMatch = false;
            for (const cell2 of that.cells) {
                if (cell1.equalValue(cell2)) {
                    foundMatch = true;
                }
            }
            if (!foundMatch) {
                return false;
            }
        }
        for (const cell1 of that.cells) {
            let foundMatch = false;
            for (const cell2 of this.cells) {
                if (cell1.equalValue(cell2)) {
                    foundMatch = true;
                }
            }
            if (!foundMatch) {
                return false;
            }
        }
        return true;
    }
}
exports.Region = Region;
class Cell {
    // Abstraction function
    //   AF[row, column, mark] = a cell located at row `row` and column `column` with mark `mark`
    // Rep Invariant: 
    //   1) 1 <= row <= 10
    //   2) 1 <= column <= 10
    //   3) The value of mark must be 0, 1, or 2
    // Safety from rep exposure:
    //   - all fields are private and readonly;
    constructor(row, column, mark) {
        this.row = row;
        this.column = column;
        this.mark = mark;
        this.checkRep();
    }
    checkRep() {
        const minDim = 1;
        const maxDim = 10;
        // 1 <= row <= 10
        (0, assert_1.default)(this.row >= minDim && this.row <= maxDim);
        // 1 <= column <= 10
        (0, assert_1.default)(this.column >= minDim && this.column <= maxDim);
        // The value of mark must be 0 or 1
        (0, assert_1.default)(this.mark === 0 || this.mark === 1);
    }
    /**
     * Retrieves the row of the cell
     *
     * @returns the row of the cell
     */
    getRow() {
        return this.row;
    }
    /**
     * Retrieves the column of the cell
     *
     * @returns the column of the cell
     */
    getColumn() {
        return this.column;
    }
    /**
     * Retrieves the mark of the cell
     *
     * @returns the mark of the cell
     */
    getMark() {
        return this.mark;
    }
    /**
     * @returns a string representation of the cell, which includes the cell's row and column
     */
    toString() {
        return `${this.row},${this.column}`;
    }
    /**
     * @param that any Cell
     * @returns true if and only if this and that have the same row and column
     */
    equalValue(that) {
        return this.row === that.row && this.column === that.column; // <= can you add if the Mark of the two cells are the same as well? Thanks! 
    }
}
exports.Cell = Cell;
// FACTORY FUNCTIONS FOR PUZZLE, REGION, AND CELL
/**
 *
 * @param row row of cell
 * @param column column of cell
 * @param mark mark of cell
 * @returns a Cell with arguments `row`, `column`, 'mark'
 */
function makeCell(row, column, mark) {
    return new Cell(row, column, mark);
}
exports.makeCell = makeCell;
/**
 *
 * @param cells cells of the region
 * @returns a Region with arguments `cells`
 */
function makeRegion(cells) {
    return new Region(cells);
}
exports.makeRegion = makeRegion;
/**
 *
 * @param regions regions of the puzzle
 * @param status status of the puzzle
 * @returns a Puzzle with arguments `regions` and `puzzles`
 */
function makePuzzle(regions, status) {
    return new Puzzle(regions, status);
}
exports.makePuzzle = makePuzzle;
//# sourceMappingURL=Puzzle.js.map