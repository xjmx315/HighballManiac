//commentController.test.js

//moking
jest.mock("../../src/services/commentService.js");
jest.mock("../../src/models/db.js");

//의존성
import CommonResponse from "../../src/prototype/commonResponse";
import commentService from "../../src/services/commentService";

//테스트 대상
import commentController from "../../src/controllers/commentController";

describe('newComment', () => {
    const req = { 
        body: {recipeId: 1, content: '맛있는 레시피네요!'},
        userInfo: { userId: 2 }
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
    const next = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('service 호출 후 200 응답', async () => {
        await commentController.newComment(req, res, next);

        expect(commentService.newComment).toHaveBeenCalledWith(req.body.recipeId, req.body.content, req.userInfo.userId);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse().setCode(201));
    });
});

describe('deleteComment', () => {
    const req = { 
        body: {commentId: 1},
        userInfo: { userId: 2 }
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
    const next = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('service 호출 후 200 응답', async () => {
        await commentController.deleteComment(req, res, next);

        expect(commentService.deleteComment).toHaveBeenCalledWith(req.body.commentId, req.userInfo.userId);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse());
    });
});

describe('getById', () => {
    const req = { 
        params: {id: 1},
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
    const next = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('service 호출 후 200 응답', async () => {
        const commentData = {id: 1, content: 'this is comment', userId: 2};
        commentService.getById.mockResolvedValue(commentData);
        await commentController.getById(req, res, next);

        expect(commentService.getById).toHaveBeenCalledWith(req.params.id);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse().setData(commentData));
    });
});

describe('getByRecipeId', () => {
    const req = { 
        params: {id: 1},
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
    const next = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('service 호출 후 200 응답', async () => {
        const commendDatas = [{id: 1, content: 'this is comment', userId: 2}];
        commentService.getByRecipeId.mockResolvedValue(commendDatas);
        await commentController.getByRecipeId(req, res, next);

        expect(commentService.getByRecipeId).toHaveBeenCalledWith(req.params.id);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse().setData(commendDatas));
    });
});