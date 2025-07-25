//recipeController.test.js

//의존성
import CommonResponse from "../../src/prototype/commonResponse";
jest.mock("../../src/services/recipeService");
import recipeService from "../../src/services/recipeService";

//테스트 대상
import recipeController from "../../src/controllers/recipeController";

describe('newRecipe', () => {
    const req = {
        headers: {},
        userInfo: { data: "this is sample user data", id: 1},
        body: {
            name: 'name',
            description: '.',
            recipe: '.',
            alcohol: '.',
            ingredients: [],
            items: []
        }
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('필수 필드 누락시 400 응답', async () => {
        const errorReq = JSON.parse(JSON.stringify(req));
        delete errorReq.body.name;

        await recipeController.newRecipe(errorReq, res);

        expect(recipeService.newRecipe).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse(false, 400, `필드 '${'name'}'이(가) 누락되었습니다. `));
    });

    test('레시피 이름 중복시 400 응답', async () => {
        recipeService.newRecipe.mockResolvedValue({ ok: false, message: '이미 같은 이름의 레시피가 있습니다. '});

        await recipeController.newRecipe(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse(false, 400, '이미 같은 이름의 레시피가 있습니다. '));
    });

    test('레시피 생성 성공시 201 응답', async () => {
        recipeService.newRecipe.mockResolvedValue({ ok: true, id: 1});

        await recipeController.newRecipe(req, res);

        expect(recipeService.newRecipe).toHaveBeenCalledWith({
            name: 'name',
            description: '.',
            recipe: '.',
            alcohol: '.',
            ingredients: [],
            items: [],
            userId: 1
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse().setCode(201).setData({ id: 1 }));
    });
});