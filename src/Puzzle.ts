import assert from "assert";

export enum PuzzleStatus {Unsolved, FullySolved}
export enum Mark {Star, Empty}

export class Puzzle {
    // Field
    private readonly regions : Array<Region>;
    private readonly status  : PuzzleStatus;

    // Abstraction function:
    //   AF(regions, status) = a 10x10 board filled with Star Battle cells. The board is divided into 
    //                          the set of contiguous regions which are mutually exclusive and collectively 
    //                          exhaustive. The puzzle board status is solved if `status` === `FullySolved`, 
    //                          and not solved if `status` === `Unsolved`

    //Rep invariant:
    //   1) each puzzleRegion must satisfy the RI of the Region class
    //   2) the regions must be mutually exclusive and collectively exhaustive the puzzle board
    //   3) status === 0 or status === 1

    // Safety from rep exposure:
    //   - all fields are private and readonly
    //   - regions is mutable, but it is never passed in as an argument to 
    //    methods or returned from methods, and therefore aliasing does not occur (there is an
    //    exception where region is passed into the constructor as a parameter, however
    //    it is defensively copied)

    public constructor(regions: Array<Region>, status: PuzzleStatus){
        this.regions = [...regions];
        this.status = status;

        this.checkRep();
    }

    private checkRep(): void {
        // each puzzle region must satisfy the RI of the Region class (this is checked by the Region checkRep)

        // status === 0 or status === 1
        assert(this.status === 0 || this.status === 1);

        assert(true);
    }

    /**
     * Retrieves the regions of the puzzle
     * 
     * @returns the regions of the puzzle
     */
    public getRegions(): Array<Region> {
        return this.regions;
    }

    /**
     * @param row desired row
     * @returns all the cells in row `row`
     */
    public getRow(row: number): Array<Cell> {
        return this.regions.reduce((rowCells, region) => rowCells.concat(region.getCells().filter(cell => cell.getRow() === row)), new Array<Cell>);
    }

    /**
     * @param column desired column
     * @returns all the cells in column `column`
     */
    public getColumn(column: number): Array<Cell> {
        return this.regions.reduce((columnCells, region) => columnCells.concat(region.getCells().filter(cell => cell.getColumn() === column)), new Array<Cell>);
    }

    /**
     * @param row row of cell
     * @param column column of cell
     * @returns the cell at row `row` and column `column`
     */
    public getCell(row: number, column: number): Cell {
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
    public addStar(row: number, column: number): Puzzle {
        const copyRegions = this.deepCopy([...this.regions]);

        const newRegions: Array<Region> = [];
        copyRegions.forEach(region => newRegions.push(makeRegion(region.getCells().map(cell => {
            if (cell.getRow() === row && cell.getColumn() === column) {
                return makeCell(row, column,  Mark.Star);
            } else {
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
    public removeStar(row: number, column: number): Puzzle {
        const copyRegions = this.deepCopy([...this.regions]);

        const newRegions: Array<Region> = [];
        copyRegions.forEach(region => newRegions.push(makeRegion(region.getCells().map(cell => {
            if (cell.getRow() === row && cell.getColumn() === column) {
                return makeCell(row, column,  Mark.Empty);
            } else {
                return cell;
            }
        }))));

        return makePuzzle(newRegions, this.status);
    }

    /**
     * 
     * @returns true if the puzzle has been solved, false if not
     */
    public isSolved(): boolean {
        const minDim = 1;
        const maxDim = this.getRegions().length;

        // check row condition
        for(let row = minDim; row <= maxDim; row++) {
            const curRow = this.getRow(row);
            let starCount = 0;
            for(const cell of curRow) {
                cell.getMark() === Mark.Star && starCount++;
            }
            if(starCount !== 2) {
                return false;
            }
        }

        // check column condition
        for(let column = minDim; column <= maxDim; column++) {
            const curColumn = this.getColumn(column);
            let starCount = 0;
            for(const cell of curColumn) {
                cell.getMark() === Mark.Star && starCount++;
            }
            if(starCount !== 2) {
                return false;
            }
        }

        // check region condition
        for(const region of this.getRegions()) {
            let starCount = 0;
            for(const cell of region.getCells()) {
                cell.getMark() === Mark.Star && starCount++;
            }
            if(starCount !== 2) {
                return false;
            }
        }

        // check neighbor condition
        for(const region of this.getRegions()) {
            for(const cell of region.getCells()) {
                for(const cell2 of this.getNeighbors(cell)) {
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
    public deepCopy(regions: Array<Region>): Array<Region> {
        const newRegions: Array<Region> = [];

        regions.forEach(region => {
            let newCells: Array<Cell> = [];
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
    public getNeighbors(cell: Cell): Array<Cell> {
        const aboveRow = this.getRow(cell.getRow()-1).filter(cell2 => 
                            (cell2.getColumn() === cell.getColumn()-1 
                            || cell2.getColumn() === cell.getColumn() 
                            || cell2.getColumn() === cell.getColumn()+1));

        const curRow = this.getRow(cell.getRow()).filter(cell2 => 
                            (cell2.getColumn() === cell.getColumn()-1  
                            || cell2.getColumn() === cell.getColumn()+1));

        const belowRow = this.getRow(cell.getRow()+1).filter(cell2 => 
                            (cell2.getColumn() === cell.getColumn()-1 
                            || cell2.getColumn() === cell.getColumn() 
                            || cell2.getColumn() === cell.getColumn()+1));

        return aboveRow.concat(curRow).concat(belowRow);
    }

    /**
     * @returns a string representation of the Puzzle
     */
    public toString(): string {
        const regions = this.getRegions();
        const dim = regions.length;

        let puzzleStr = `${dim}x${dim}\n`;

        for(const region of regions) {
            // add stars first
            for (const cell of region.getCells()) {
                if(cell.getMark() === Mark.Star) {
                    puzzleStr += `${cell.toString()} `;
                }
            }
            // separate by pipe
            puzzleStr += '| ';

            // now add non-stars
            for (const cell of region.getCells()) {
                if(cell.getMark() !== Mark.Star) {
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
    public equalValue(that: Puzzle): boolean {

        // make sure lengths are equal
        if(this.regions.length !== that.regions.length) {
            return false;
        }

        for (const region1 of this.regions) {
            let foundMatch = false;
            for (const region2 of that.regions) {
                if(region1.equalValue(region2)) {
                    foundMatch = true;
                }
            }
            if(!foundMatch) {
                return false;
            }
        }

        for (const region1 of that.regions) {
            let foundMatch = false;
            for (const region2 of this.regions) {
                if(region1.equalValue(region2)) {
                    foundMatch = true;
                }
            }
            if(!foundMatch) {
                return false;
            }
        }
        
        return true;
    }

}

export class Region {
    //Field
    private readonly cells: Array<Cell>;

    // Abstraction function
    //   AF[cells] = given a set of cells, create a continuous region. 

    // Rep Invariant: 
    //   Region must be contiguous (this is already true since we are being provided valid game files)

    // Safety from rep exposure:
    //   - all fields are private and readonly;
    //   - cells is mutable, but it is never passed in as an argument to 
    //    methods, and therefore aliasing does not occur (there is an
    //    exception where cells is passed into the constructor as a parameter, however
    //    it is defensively copied)

    public constructor(cells: Array<Cell>){
        this.cells = [...cells];

        this.checkRep();
    }

    private checkRep(): void {
        // check for contiguousy
        assert(true);
    }

    /**
     * Retrieves the cells of the region
     * 
     * @returns the cells of the region
     */
    public getCells(): Array<Cell> {
        return this.cells;
    }

    /**
     * @returns a string representation of the region
     */
    public toString(): string {
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
    public equalValue(that: Region): boolean {

        // make sure lengths are equal
        if(this.cells.length !== that.cells.length) {
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

export class Cell {
    //Field
    private readonly row: number;
    private readonly column: number; 
    private readonly mark: Mark;

    // Abstraction function
    //   AF[row, column, mark] = a cell located at row `row` and column `column` with mark `mark`

    // Rep Invariant: 
    //   1 <= row <= 10
    //   1 <= column <= 10
    //   The value of mark must be 0 or 1

    // Safety from rep exposure:
    //   - all fields are private and readonly;
    //   - row, column, and mark are all immutable

    public constructor(row: number, column: number, mark: Mark){
        this.row = row;
        this.column = column;
        this.mark = mark;

        this.checkRep();
    }

    private checkRep(): void {
        const minDim = 1;
        const maxDim = 10;
        // 1 <= row <= 10
        assert(this.row >= minDim && this.row <= maxDim);

        // 1 <= column <= 10
        assert(this.column >= minDim && this.column <= maxDim);

        // The value of mark must be 0 or 1
        assert(this.mark === 0 || this.mark === 1);
    }

    /**
     * Retrieves the row of the cell
     * 
     * @returns the row of the cell
     */
    public getRow(): number {
        return this.row;
    }

    /**
     * Retrieves the column of the cell
     * 
     * @returns the column of the cell
     */
    public getColumn(): number {
        return this.column;
    }

    /**
     * Retrieves the mark of the cell
     * 
     * @returns the mark of the cell
     */
    public getMark(): Mark {
        return this.mark;
    }

    /**
     * @returns a string representation of the cell, which includes the cell's row and column
     */
    public toString(): string {
        return `${this.row},${this.column}`;
    }

    /**
     * @param that any Cell
     * @returns true if and only if this and that have the same row and column
     */
    public equalValue(that: Cell): boolean {
        return this.row === that.row && this.column === that.column;  // <= can you add if the Mark of the two cells are the same as well? Thanks! 
    }
}


// FACTORY FUNCTIONS FOR PUZZLE, REGION, AND CELL

/**
 * 
 * @param row row of cell
 * @param column column of cell
 * @param mark mark of cell
 * @returns a Cell with arguments `row`, `column`, 'mark'
 */
export function makeCell(row: number, column: number, mark: Mark): Cell {
    return new Cell(row, column, mark);
}

/**
 * 
 * @param cells cells of the region
 * @returns a Region with arguments `cells`
 */
export function makeRegion(cells: Array<Cell>): Region {
    return new Region(cells);
}

/**
 * 
 * @param regions regions of the puzzle
 * @param status status of the puzzle
 * @returns a Puzzle with arguments `regions` and `puzzles`
 */
export function makePuzzle(regions: Array<Region>, status: PuzzleStatus): Puzzle {
    return new Puzzle(regions, status);
}


