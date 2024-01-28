enum puzzleStatus{
    solved = "solved",
    inProgress = "inProgress",
    empty = 'empty'
}
import assert from 'assert';
import { Puzzle } from './Puzzle';
import { emptyPuzzleParser } from './Parser';
export class Client {
    // Fields
    private puzzle: Puzzle;
    private readonly oriPuzzle : Puzzle;

    // Abstraction function:
    //      AF(puzzle, solved) = a client that allows the user to interact with a Star Battle game puzzle
    //
    // Representation invariant:
    //      - `puzzle` is a Puzzle instance
    //      
    // Safety from rep exposure:
    //      All fields are private and never returned

    public constructor( puzzle: Puzzle){
        this.puzzle = puzzle;
        this.oriPuzzle = puzzle;
        // this.puzzleString = puzzleString;
    }

    public getPuzzle(): Puzzle {
        return this.puzzle;
    }



    /**
     * asserts the representation invariant
     */
    public checkRep(): void {
        assert(this.puzzle instanceof Puzzle);
    }

    /**
     * @returns a string representation of the Puzzle ADT
     */
    public toString(): string{
        return this.puzzle.toString();
    }

    /**
     * @returns if the puzzle is solved or not
     */
    public getStatus(): boolean{
        return this.puzzle.isSolved();
    }

    /**
     * @param row: row the star will be placed
     * @param col: column the star will be placed
     */
    public addStar(row: number, col: number): void{
        const newPuzzle = this.puzzle.addStar(row, col);
        this.puzzle = newPuzzle; 
    }

    /**
     * @param row: row the star will be removed
     * @param col: column the star will be removed
     */
    public removeStar(row: number, col: number): void{
        const newPuzzle = this.puzzle.removeStar(row, col);
        this.puzzle = newPuzzle; 
    }

    /**
     * @returns, void, refresh the puzzle of the client
     */
    public refresh(): void {
        this.puzzle =this.oriPuzzle;
    }
};