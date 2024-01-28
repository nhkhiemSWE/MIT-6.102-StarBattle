import assert from 'assert';
import { Puzzle } from '../src/Puzzle';
import { WebServer } from '../src/StarbServer';

describe('server', function () {
    /**
     * Testing Strategy for WebServer
     *      partition on valid / invalid path
     */

    it('Covers valid route', async () => {
        const request = require('supertest');
        const app = require('../app');
        const response = await request(app).get('/puzzles/kd-1-1-1');
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.type, 'text');
        assert(response.text.length > 0);
        console.log("a");
    });

    it('Cover invalid puzzle', async () => {
        const request = require('supertest');
        const app = require('../app');
        const response = await request(app).get('/fakepath');
        assert.strictEqual(response.status, 404); // Throws an error
    });
    
});
