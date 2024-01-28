"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
/*
 * Testing strategy
 *
 */
describe('Puzzle ADT Tests', function () {
    // Testing Strategy
    //  - Partition on number of Regions: 0, 1, >1
    //  - Partition on shape of Region in the puzzle: 1 x Col, Row x 1, rectangle, non-rectangle
    //  - Partition on status: unsolved, partially solved, completely solved 
    //  - Partition on number of Star:
    //      +) in the puzzle: 0, 1, >1 but not all, all
    //      +) in one row:    0, 1, >1 but not all, all
    //      +) in one column: 0, 1, >1 but not all, all
    //      +) in one region:  0, 1, >1 but not all, all
    //  
    it('Filler Test Case', function () {
        (0, assert_1.default)(true);
    });
});
//# sourceMappingURL=PuzzleTest.js.map