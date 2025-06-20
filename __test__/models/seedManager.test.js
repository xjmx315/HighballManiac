import seedManager from "../../src/models/seedManager.js";
import db from "../../src/models/db.js";

/*db 초기화 작업을 진행하는 다른 테스트와 같이 진행시 테스트가 실패하는 경우가 있으니 단독으로 테스트 해주세요. */

describe('seedManager Test', () => {
    test('init DB', async () => {
        await seedManager.initDB();
    });

    afterAll(async () => {
        await db.end();
    })
});