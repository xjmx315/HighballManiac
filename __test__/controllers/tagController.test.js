//tagController.test.js

//의존성
import CommonResponse from "../../src/prototype/commonResponse";
jest.mock("../../src/services/tagService");
import tagService from "../../src/services/tagService";

//테스트 대상
import tagController from "../../src/controllers/tagController";


describe('searchTags', () => {
    const req = {
        query: {
            name: '베이스'
        }
    }
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('쿼리 없음 400 응답', async () => {
        const result = await tagController.searchTags({query: {}}, res);

        expect(tagService.searchTags).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse(false, 400, "쿼리가 누락되었습니다. "));
    });

    test('name 쿼리로 검색', async () => {
        const tagData = [{name: '럼 베이스', id:28}, {name: '보드카 베이스', id: 27}];
        tagService.searchTags.mockResolvedValue(tagData);

        const result = await tagController.searchTags(req, res);

        expect(tagService.searchTags).toHaveBeenCalledWith('베이스');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse().setData(tagData));
    });
});

describe('getById', () => {
    const req = {
        params: {
            id: 28
        }
    }
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('잘못된 id', async () => {
        const result = await tagController.getById({params: {id: 'wrong'}}, res);

        expect(tagService.getById).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse(false, 400, "쿼리 형식이 잘못되었습니다. "));
    });

    test('존재하지 않는 id', async () => {
        tagService.getById.mockResolvedValue(undefined);

        const result = await tagController.getById(req, res);

        expect(tagService.getById).toHaveBeenCalledWith(28);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse(false, 404, '존재하지 않는 id 입니다. '));
    });

    test('성공적 조회', async () => {
        const tagData = {name: '럼 베이스', id:28};
        tagService.getById.mockResolvedValue(tagData);

        const result = await tagController.getById(req, res);

        expect(tagService.getById).toHaveBeenCalledWith(28);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(new CommonResponse().setData(tagData));
    });
});