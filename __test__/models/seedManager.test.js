import seedManager from "../../src/models/seedManager.js";
import db from "../../src/models/db.js";

describe('seedManager Test', () => {
    test('init DB', async () => {
        await seedManager.initDB();
    });

    afterAll(async () => {
        await db.end();
    })
});