//recipeController.test.js

//moking
jest.mock("../../src/services/recipeService");
jest.mock("../../src/services/tagService");
jest.mock("../../src/models/db");

//의존성
import CommonResponse from "../../src/prototype/commonResponse";
import recipeService from "../../src/services/recipeService";
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
            items: [],
            tags: []
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
            userId: 1,
            tags: []
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

    test('존재하지 않는 레시피 404', async () => {
        recipeService.getById.mockResolvedValue(undefined);
        await recipeController.addTag(req, res);

        expect(recipeService.getById).toHaveBeenCalledWith(1);
        expect(recipeService.addTag).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse(false, 404, '존재하지 않는 레시피 입니다. '));
    });

    test('권한 없음 403', async () => {
        //userInfo의 id는 1
        recipeService.getById.mockResolvedValue({user_id: 400}); 
        await recipeController.addTag(req, res);

        expect(recipeService.getById).toHaveBeenCalledWith(1);
        expect(recipeService.addTag).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse(false, 403, '자신이 업로드한 레시피만 수정할 수 있습니다. '));
    });

    test('태그 없음 404', async () => {
        recipeService.getById.mockResolvedValue({user_id: 1}); 
        tagService.getById.mockResolvedValue(undefined); 
        await recipeController.addTag(req, res);

        expect(recipeService.getById).toHaveBeenCalledWith(1);
        expect(tagService.getById).toHaveBeenCalledWith(2);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse(false, 404, '존재하지 않는 태그입니다. '));
    });

    test('등록 성공 200', async () => {
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

describe('deleteTag', () => {
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

    test('존재하지 않는 레시피 404', async () => {
        recipeService.getById.mockResolvedValue(undefined);
        await recipeController.deleteTag(req, res);

        expect(recipeService.getById).toHaveBeenCalledWith(1);
        expect(recipeService.deleteTag).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse(false, 404, '존재하지 않는 레시피 입니다. '));
    });

    test('권한 없음 403', async () => {
        //userInfo의 id는 1
        recipeService.getById.mockResolvedValue({user_id: 400}); 
        await recipeController.deleteTag(req, res);

        expect(recipeService.getById).toHaveBeenCalledWith(1);
        expect(recipeService.deleteTag).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse(false, 403, '자신이 업로드한 레시피만 수정할 수 있습니다. '));
    });

    test('레시피에 이미 없는 태그 200', async () => {
        recipeService.getById.mockResolvedValue({user_id: 1});
        recipeService.getTags.mockResolvedValue(undefined);
        await recipeController.deleteTag(req, res);

        expect(recipeService.getById).toHaveBeenCalledWith(1);
        expect(recipeService.deleteTag).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse());
    });

    test('제거 성공 200', async () => {
        recipeService.getById.mockResolvedValue({user_id: 1});
        recipeService.getTags.mockResolvedValue([ { name: '달콤한', id: 2 } ]); 
        recipeService.deleteTag.mockResolvedValue(true);
        await recipeController.deleteTag(req, res);

        expect(recipeService.getById).toHaveBeenCalledWith(1);
        expect(recipeService.deleteTag).toHaveBeenCalledWith(1, 2);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse());
    });
});

describe('setTags', () => {
    const req = {
        headers: {},
        userInfo: { name: "sample user name", userId: 1},
        body: {
            recipeId: 1,
            tagList: [1, 2, 4]
        }
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    beforeAll(() => {
        tagService.getById.mockImplementation((id) => {
            return new Promise((resolve, reject) => {
                if (id <= 50){
                    resolve({ data: "this is sample user data" });
                }
                else{
                    resolve(false);
                }
            });
        })
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('존재하지 않는 레시피 404', async () => {
        recipeService.getById.mockResolvedValue(undefined);
        await recipeController.setTags(req, res);

        expect(recipeService.getById).toHaveBeenCalledWith(1);
        expect(recipeService.setTags).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse(false, 404, '존재하지 않는 레시피 입니다. '));
    });

    test('권한 없음 403', async () => {
        //userInfo의 id는 1
        recipeService.getById.mockResolvedValue({user_id: 400}); 
        await recipeController.setTags(req, res);

        expect(recipeService.getById).toHaveBeenCalledWith(1);
        expect(recipeService.setTags).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse(false, 403, '자신이 업로드한 레시피만 수정할 수 있습니다. '));
    });

    test('일부 태그 성공 200', async () => {
        //태그가 존재하지 않을 경우 해당 태그만 실패하면 됨. 
        recipeService.getById.mockResolvedValue({user_id: 1});
        const errorReq = JSON.parse(JSON.stringify(req));
        errorReq.body.tagList.push(400); //존재하지 않는 태그 추가
        recipeService.setTags.mockResolvedValue([400]);
        recipeService.getTags.mockResolvedValue([1, 2, 3]);

        await recipeController.setTags(errorReq, res);

        expect(recipeService.getById).toHaveBeenCalledWith(1);
        expect(recipeService.setTags).toHaveBeenCalledWith(recipeService.addTag, recipeService.deleteTag, 1, [1, 2, 3], [1, 2, 4, 400]);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse().setMessage('일부 태그 삽입에 실패했습니다. ').setData([400]));
    });

    test('모든 태그 성공 200', async () => {
        recipeService.getById.mockResolvedValue({user_id: 1});
        recipeService.setTags.mockResolvedValue([]);
        recipeService.getTags.mockResolvedValue([1, 2, 3]);

        await recipeController.setTags(req, res);

        expect(res.json).toHaveBeenCalledWith(new CommonResponse());
        expect(recipeService.getById).toHaveBeenCalledWith(1);
        expect(recipeService.setTags).toHaveBeenCalledWith(recipeService.addTag, recipeService.deleteTag, 1, [1, 2, 3], [1, 2, 4]);
        expect(res.status).toHaveBeenCalledWith(200);
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
        const tagData = [{name: '달달한', id: 1}];
        recipeService.getById.mockResolvedValue(recipeData);
        recipeService.getTags.mockResolvedValue(tagData);

        await recipeController.getById(req, res);

        expect(recipeService.getById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse().setData({...recipeData, tags: tagData}));
    });
});

describe('getTags', () => {
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

    test('존재하지 않는 아이디 요청시 404', async () => {
        recipeService.getTags.mockResolvedValue(undefined);

        await recipeController.getTags(req, res);

        expect(recipeService.getTags).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse(false, 404, "id 또는 등록된 태그가 없습니다. "));
    });

    test('성공적 검색 200', async () => {
        const tagData = [{name: '럼 베이스', id:28}, {name: '보드카 베이스', id: 27}];
        recipeService.getTags.mockResolvedValue(tagData);

        await recipeController.getTags(req, res);

        expect(recipeService.getTags).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse().setData(tagData));
    });
});

describe('getItemsAndIngredients', () => {
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

    test('요청 실패 404', async () => {
        recipeService.getItemsAndIngredients.mockResolvedValue(undefined);

        await recipeController.getItemsAndIngredients(req, res);

        expect(recipeService.getItemsAndIngredients).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse(false, 404, "id 또는 등록된 태그가 없습니다. "));
    });

    test('성공적 검색 200', async () => {
        //ingredient에는 id가 +100 됩니다!
        const itemData = [{id: 101, name: '바카디 모히또', image: '~~', discription: '라임향의 달달한 리큐르 입니다. '}];
        recipeService.getItemsAndIngredients.mockResolvedValue(itemData);

        await recipeController.getItemsAndIngredients(req, res);

        expect(recipeService.getItemsAndIngredients).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(new CommonResponse().setData(itemData));
        expect(res.status).toHaveBeenCalledWith(200);
    });
});

describe('getByUserId', () => {
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

    test('알 수 없는 에러', async () => {
        recipeService.getByUserId.mockResolvedValue({err: "에러 발생!"});

        await recipeController.getByUserId(req, res);

        expect(recipeService.getByUserId).toHaveBeenCalledWith(1);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse(false, 500, "에러 발생!"));
        expect(res.status).toHaveBeenCalledWith(500);
    });

    test('요청 성공', async () => {
        recipeService.getByUserId.mockResolvedValue([{name: "진 피즈", recipe: "~~~"}]);

        await recipeController.getByUserId(req, res);

        expect(recipeService.getByUserId).toHaveBeenCalledWith(1);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse().setData([{name: "진 피즈", recipe: "~~~"}]));
        expect(res.status).toHaveBeenCalledWith(200);
    });
});
