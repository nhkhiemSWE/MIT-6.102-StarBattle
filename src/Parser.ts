import assert from 'assert';
import { Puzzle, Cell, Region, Mark, PuzzleStatus, makeCell, makePuzzle, makeRegion} from './Puzzle';
import { Parser, ParseTree, compile, visualizeAsUrl } from 'parserlib';
import fs from 'fs';

/**
 *  blankGrammar description:
 * puzzle is the size followed by the regions
 * size will always be 10x10
 * regions is region followed by one or more region
 * region corresponds to Coordinates + "\n"
 * Coordinates is one or more coords
 * coord is two ints separated by a ","
 */
const blankGrammar: string = `
@skip whitespace {
    puzzle ::= comments* size [\\n]+ region+;
    size ::= number 'x' number;
    region ::= '|' (cell)+ [\\n]+;
    cell ::= number ',' number;
    comments ::= '#' [\\S]* [\\n];
}
whitespace ::= [ \\t\\r]+;
number ::= [0-9]+;
`;

/**
 *  solvedGrammar description
 * puzzle is the size followed by the regions
 * size will always be 10x10
 * regions is region followed by one or more region
 * region corresponds to starCoords and remainingCoordinates separated by |
 * starCoords is supposed to only be 2 coord
 * remainingCoordinates is one or more coord
 * coord is two ints separated by a ","
 */

const solvedGrammar: string = `
@skip whitespace {
    puzzle ::= comments* size [\\n]+ (region)+;
    size ::= number 'x' number;
    region ::= solution '|' block;
    cell ::= number ',' number;
    solution ::= cell{2};
    block ::= (cell)+ [\\n]+;
    comments ::= '#' [\\S]* [\\n];
}
whitespace ::= [ \\t\\r]+;
number ::= [0-9]+;
`;

// the nonterminals of the grammar
export enum PuzzleGrammar { Puzzle, Size, Region, Cell, Number, Solution, Whitespace, Block, Comments}

// compile the grammar for an empty puzzle into a parser
export const emptyParser: Parser<PuzzleGrammar> = compile(blankGrammar, PuzzleGrammar, PuzzleGrammar.Puzzle);


// compile the grammar for an empty puzzle into a parser
export const solvedParser: Parser<PuzzleGrammar> = compile(solvedGrammar, PuzzleGrammar, PuzzleGrammar.Puzzle);


/**
 * Load the string from a file given the fileName of that file
 * @param fileName, a string representing the name of that file
 * @returns, (a promise for) the string representing a puzzle (empty or solved)
 */
export async function loadFile(fileName : string) : Promise<string> {
    const file = await fs.promises.readFile(fileName, {encoding: 'utf-8'});
    return file;
}

/**
 * Parse a string into an expression.
 * 
 * @param input string to parse
 * @returns Expression parsed from the string
 * @throws ParseError if the string doesn't match the Expression grammar
 */
export function emptyPuzzleParser(input: string): Puzzle {
    // parse the example into a parse tree
    const parseTree: ParseTree<PuzzleGrammar> = emptyParser.parse(input);

    // display the parse tree in various ways, for debugging only
    // console.log("parse tree:\n" + parseTree);
    // console.log(visualizeAsUrl(parseTree, PuzzleGrammar));

    // make an AST from the parse tree
    const emptyPuzzle: Puzzle = makeAbstractSyntaxTreeForEmpty(parseTree);
    // console.log("abstract syntax tree:\n" + emptyPuzzle);
    return emptyPuzzle;
}

/**
 * Convert a parse tree into an abstract syntax tree.
 * 
 * @param parseTree constructed according to the grammar for image meme expressions
 * @returns abstract syntax tree corresponding to the parseTree
 */
function makeAbstractSyntaxTreeForEmpty(parseTree: ParseTree<PuzzleGrammar>): Puzzle {
    const regions = new Array(); 
    assert(parseTree.childrenByName(PuzzleGrammar.Region), 'missing region');
    for (const region of parseTree.childrenByName(PuzzleGrammar.Region)) {
        const setCells = new Array();
        assert(region.childrenByName(PuzzleGrammar.Cell), 'missing a child');
        for (const cell of region.children) {
            assert(cell.children[0], 'missing a child');
            assert(cell.children[1], 'missing a child');
            setCells.push(new Cell(parseInt(cell.children[0].text ), parseInt(cell.children[1].text), Mark.Empty));
        }
        regions.push(new Region(setCells));
    }
    return new Puzzle(regions, PuzzleStatus.Unsolved);
}
/**
* Parse a string into an expression.
* 
* @param input string to parse
* @returns Expression parsed from the string
* @throws ParseError if the string doesn't match the Expression grammar
*/
export function solvedPuzzleParser(input: string): Puzzle {
   // parse the example into a parse tree
   const parseTree: ParseTree<PuzzleGrammar> = solvedParser.parse(input);

   // display the parse tree in various ways, for debugging only
//    console.log("parse tree:\n" + parseTree);
//    console.log(visualizeAsUrl(parseTree, PuzzleGrammar));

   // make an AST from the parse tree
   const solvedPuzzle: Puzzle = makeAbstractSyntaxTreeForSolved(parseTree);
//    console.log("abstract syntax tree:\n" + solvedPuzzle);
   return solvedPuzzle;
}
/**
 * Convert a parse tree into an abstract syntax tree.
 * 
 * @param parseTree constructed according to the grammar for image meme expressions
 * @returns abstract syntax tree corresponding to the parseTree
 */
function makeAbstractSyntaxTreeForSolved(parseTree: ParseTree<PuzzleGrammar>): Puzzle {
    const regions = new Array(); 
    assert(parseTree.childrenByName(PuzzleGrammar.Region), 'missing region');
    for (const region of parseTree.childrenByName(PuzzleGrammar.Region)) {
        const setCells = new Array();
        assert(region.children[0], 'missing a child');
        assert(region.children[1], 'missing a child');
        for (const star of region.children[0].children) {
            assert(star.children[0], 'missing a child');
            assert(star.children[1], 'missing a child');
            setCells.push(new Cell(parseInt(star.children[0].text ), parseInt(star.children[1].text), Mark.Empty));
        }
        for (const cell of region.children[1].children) {
            assert(cell.children[0], 'missing a child');
            assert(cell.children[1], 'missing a child');
            setCells.push(new Cell(parseInt(cell.children[0].text ), parseInt(cell.children[1].text), Mark.Empty));
        }
        regions.push(new Region(setCells));
    }
    return new Puzzle(regions, PuzzleStatus.FullySolved);
}


function main() {
    const input =  `# This is an solved Puzzle
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
    const puzzle: Puzzle = solvedPuzzleParser(input);
}

if (require.main === module) {
    main();
}