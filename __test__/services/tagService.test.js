//tagService.test.js

//의존성
jest.mock("../../src/models/tagModel");
import tagModel from "../../src/models/tagModel";

//테스트 대상
import tagService from "../../src/services/tagService";

describe('searchTags', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('검색 실패', async () => {
        tagModel.searchTags.mockRejectedValue('error!');
        const result = await tagService.searchTags('베이스');

        expect(tagModel.searchTags).toHaveBeenCalledWith('베이스');
        expect(result).toEqual([]);
    });

    test('검색 성공', async () => {
        const tagData = [{name: '럼 베이스', id:28}, {name: '보드카 베이스', id: 27}];
        tagModel.searchTags.mockResolvedValue(tagData);

        const result = await tagService.searchTags('베이스');

        expect(tagModel.searchTags).toHaveBeenCalledWith('베이스');
        expect(result).toEqual(tagData);
    });
});

describe('getById', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('없으면 undefined 리턴', async () => {
        tagModel.getById.mockResolvedValue([]);
        const result = await tagService.getById(28);

        expect(tagModel.getById).toHaveBeenCalledWith(28);
        expect(result).toEqual(undefined);
    });

    test('있으면 tag 정보 리턴', async () => {
        const tagData = [{name: '럼 베이스', id:28}];
        tagModel.getById.mockResolvedValue(tagData);

        const result = await tagService.getById(28);

        expect(tagModel.getById).toHaveBeenCalledWith(28);
        expect(result).toEqual({name: '럼 베이스', id:28});
    });
});