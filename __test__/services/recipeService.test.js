//recipeService.test.js

//의존성
jest.mock("../../src/models/recipeModel.js");
import recipeModel from "../../src/models/recipeModel.js";
//테스트 대상
import recipeService from "../../src/services/recipeService";

describe('newRecipe', () => {
    let recipe = {
        name: 'name',
        description: '.',
        recipe: '.',
        alcohol: '.',
        ingredients: [],
        items: [],
        userId: 1
    };

    beforeEach(() => {
        jest.clearAllMocks();
        recipe = {
            name: 'name',
            description: '.',
            recipe: '.',
            alcohol: '.',
            ingredients: [],
            items: [],
            userId: 1
        };
    });

    test('알 수 없는 에러에도 유연하게 처리', async () => {
        recipeModel.newRecipe.mockRejectedValue(new Error('error!!'));

        const result = await recipeService.newRecipe(recipe);

        expect(result).toEqual({ ok: false, message: '지정되지 않은 에러가 발생했습니다. : error!!'});
    });

    test('이미 있는 이름은 실패', async () => {
        recipeModel.newRecipe.mockRejectedValue(new Error("Duplicate entry '진 피즈' for key 'recipes.name'"));

        const result = await recipeService.newRecipe(recipe);

        expect(result).toEqual({ ok: false, message: '이미 같은 이름의 레시피가 있습니다. '});
    });

    test('레시피 생성 성공시 id 반환(이미지 자동 공백 처리)', async () => {
        recipeModel.newRecipe.mockResolvedValue({insertId: 1});

        const result = await recipeService.newRecipe(recipe);

        expect(recipeModel.newRecipe).toHaveBeenCalledWith({image: '', ...recipe});
        expect(result).toEqual({ ok: true, id: 1});
    });

    test('레시피 생성 성공시 id 반환(이미지가 있으면 있는 걸로 처리)', async () => {
        recipeModel.newRecipe.mockResolvedValue({insertId: 1});
        const recipeWithImage = JSON.parse(JSON.stringify(recipe));
        recipeWithImage.image = 'image';

        const result = await recipeService.newRecipe(recipeWithImage);

        expect(recipeModel.newRecipe).toHaveBeenCalledWith({image: 'image', ...recipe});
        expect(result).toEqual({ ok: true, id: 1});
    });
});

/*
describe('searchRecipeByName', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    test('존재하지 않는 이름 검색 시도시 undifine 반환', async () => {
        recipeModel.searchRecipeByName.mockResolvedValue([]);

        const result = await recipeService.searchRecipeByName('없는 이름');

        expect(recipeModel.searchRecipeByName).toHaveBeenCalledWith('없는 이름');
        expect(result).toBeEqual(undefined);
    });

    test('이름이 존재할 경우 recipe 객체 배열 반환', async () => {
        const recipe = {
            name: '있는 이름',
            description: 'test obj'
        };
        recipeModel.searchRecipeByName.mockResolvedValue([recipe]);

        const result = await recipeService.searchRecipeByName('있는 이름');

        expect(recipeModel.searchRecipeByName).toHaveBeenCalledWith('있는 이름');
        expect(result).toBeEqual([recipe]);
    });
});
*/