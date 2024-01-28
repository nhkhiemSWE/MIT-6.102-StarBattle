"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
var puzzleStatus;
(function (puzzleStatus) {
    puzzleStatus["solved"] = "solved";
    puzzleStatus["inProgress"] = "inProgress";
    puzzleStatus["empty"] = "empty";
})(puzzleStatus || (puzzleStatus = {}));
class Client {
    // Abstraction function:
    //      AF(puzzle, solved) = a client that allows the user to interact with a Star Battle game puzzle
    //
    // Representation invariant:
    //      - `puzzle` is a Puzzle instance
    //      - `solved` is a boolean
    //      
    // Safety from rep exposure:
    //      All fields are private and never returned
    constructor(puzzle) {
        this.puzzle = puzzle;
        this.oriPuzzle = puzzle;
        // this.puzzleString = puzzleString;
    }
    getPuzzle() {
        return this.puzzle;
    }
    /**
     * asserts the representation invariant
     */
    checkRep() {
        throw new Error("Not Implemented");
    }
    /**
     * @returns a string representation of the Puzzle ADT
     */
    toString() {
        return this.puzzle.toString();
    }
    /**
     * @returns if the puzzle is solved or not
     */
    getStatus() {
        return this.puzzle.isSolved();
    }
    /**
     * @param row: row the star will be placed
     * @param col: column the star will be placed
     */
    addStar(row, col) {
        const newPuzzle = this.puzzle.addStar(row, col);
        this.puzzle = newPuzzle;
    }
    /**
     * @param row: row the star will be removed
     * @param col: column the star will be removed
     */
    removeStar(row, col) {
        const newPuzzle = this.puzzle.removeStar(row, col);
        this.puzzle = newPuzzle;
    }
    /**
     * @returns, void, refresh the puzzle of the client
     */
    refresh() {
        this.puzzle = this.oriPuzzle;
    }
}
exports.Client = Client;
;
//# sourceMappingURL=clientADT.js.map