//recipeController.test.js

//의존성
import CommonResponse from "../../src/prototype/commonResponse";
jest.mock("../../src/services/recipeService");
import recipeService from "../../src/services/recipeService";
jest.mock("../../src/services/tagService");
import tagService from "../../src/services/tagService";

//테스트 대상
import recipeController from "../../src/controllers/recipeController";

describe('newRecipe', () => {
    const req = {
        headers: {},
        userInfo: { data: "this is sample user data", userId: 1},
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

describe('addTag', () => {
    const req = {
        headers: {},
        userInfo: { name: "sample user name", userId: 1},
        body: {
            recipeId: 1,
            tagId: 2
        }
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('존재하지 않는 레시피', async () => {
        recipeService.getById.mockResolvedValue(undefined);
        await recipeController.addTag(req, res);

        expect(recipeService.getById).toHaveBeenCalledWith(1);
        expect(recipeService.addTag).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse(false, 404, '존재하지 않는 레시피 입니다. '));
    });

    test('권한 없음', async () => {
        //userInfo의 id는 1
        recipeService.getById.mockResolvedValue({user_id: 400}); 
        await recipeController.addTag(req, res);

        expect(recipeService.getById).toHaveBeenCalledWith(1);
        expect(recipeService.addTag).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse(false, 403, '자신이 업로드한 레시피만 수정할 수 있습니다. '));
    });

    test('태그 없음', async () => {
        recipeService.getById.mockResolvedValue({user_id: 1}); 
        tagService.getById.mockResolvedValue(undefined); 
        await recipeController.addTag(req, res);

        expect(recipeService.getById).toHaveBeenCalledWith(1);
        expect(tagService.getById).toHaveBeenCalledWith(2);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse(false, 404, '존재하지 않는 태그입니다. '));
    });

    test('등록 성공', async () => {
        recipeService.getById.mockResolvedValue({user_id: 1}); 
        tagService.getById.mockResolvedValue({naem: '달콤한', id: 1}); 
        recipeService.addTag.mockResolvedValue(true);//이미 테그가 있었다면 false 
        await recipeController.addTag(req, res);

        expect(recipeService.getById).toHaveBeenCalledWith(1);
        expect(tagService.getById).toHaveBeenCalledWith(2);
        expect(recipeService.addTag).toHaveBeenCalledWith(1, 2);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse());
    });
});

describe('getById', () => {
    const req = {
        params: {
            id: 1
        }
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('필수 항목 누락시 400', async () => {
        const errorReq = JSON.parse(JSON.stringify(req));
        delete errorReq.params.id;

        await recipeController.getById(errorReq, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse(false, 400, "id를 포함해야 합니다. "));
    });

    test('존재하지 않는 아이디 요청시 404', async () => {
        recipeService.getById.mockResolvedValue(undefined);

        await recipeController.getById(req, res);

        expect(recipeService.getById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse(false, 404, "존재하지 않는 id 입니다. "));
    });

    test('성공적 검색 200', async () => {
        const recipeData = {
            "id": 1,
            "user_id": 1,
            "name": "진 피즈",
            "description": "탄산수, 레몬주스, 설탕이 들어간 유명한 칵테일. ",
            "recipe": "1. 셰이커에 탄산수를 제외한 주재료를 얼음과 함께 넣고 잘 흔들어준다.\n2. 얼음을 걸러내 텀블러 글라스에 따라준다. 이때 텀블러 글라스에 얼음은 넣지 않는다.\n3. 약간의 탄산수를 부어서 채워준다.\n4. 레몬 슬라이스와 원한다면 레몬 제스트로 가니쉬해준다.",
            "image": "",
            "alcohol_percentage": 13,
            "created_at": "2025-07-25T16:33:41.000Z"
        }
        recipeService.getById.mockResolvedValue(recipeData);

        await recipeController.getById(req, res);

        expect(recipeService.getById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse().setData(recipeData));
    });
});