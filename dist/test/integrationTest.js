"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {Puzzle} from '..iter0/nhkhiem/puzzle'; <= it gives an error if uncomment? 
/*
 * Testing strategy
 *
 */
describe('Integration Tests', function () {
    // Testing Strategy
    //  - Partition on client action: click once for a dot, click twice for a star, click three times to empty a cell
    //  - Partition on number of placed stars  : 0, 1, >1, full board. 
    //  - Partition on number of placed dot    : 0, 1, >1, full board. 
    //  - Partition on the status of the board : unsolved, partitially solved, uncorrectly solved, correctly solved 
    //  - Partition on positions of the stars  : obey the rule, more than 2 stars in a region, more than 2 stars in a row,
    //                                           more than 2 stars in a col, 2 stars share a mutual side or point, 
    //                                           no star in a region, no star in a row, no star in a col. 
    //  - Partition on position to click       : empty cell, cell with a dot, cell with a star
    //  
    /*
     * Manual test: how the board response to the client's action
     * Covers: client actions
     * 1. click once an empty cell => assert that the cell now contains a dot
     * 2. click the second time on that cell => assert that the cell now contains a star
     * 3. click the third time on that cell => assert that the cell is now empty again
     */
    /*
     * Manual test: the board allows client to place stars without any limitation
     * Covers: number of stars and positions of those star
     * 1. Fill a whole row with stars => assert no errors are thrown
     * 2. Fill a whole col with stars => assert no errors are thrown
     * 3. Fill a whole region with stars => assert no errors are thrown
     * 4. Put two stars or more stars within a 3x3 box => assert no errors are thrown
     * 5. Fill the whole board with stars => assert no errors are thrown
     */
    /*
     * Manual test: The status of the board is up-to-date and correct
     * Covers: Different status of the board
     * 1. Open the browser => assert that board is empty, the regions' borders are highlight
     * 2. click "education"
     * 3. click "academic calendar" => assert that page shows previous June through next June
     */
});
//# sourceMappingURL=integrationTest.js.map