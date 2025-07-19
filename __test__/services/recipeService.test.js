//recipeService.test.js

//의존성
jest.mock("../../src/models/recipeModel.js");
import recipeModel from "../../src/models/recipeModel.js";
//테스트 대상
import recipeService from "../../src/services/recipeService";

describe('newRecipe', () => {
    const recipe = {
        name: 'name',
        discription: '.',
        recipe: '.',
        alcohol: '.',
        ingredients: [],
        items: [],
        userId: 1
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('이미 있는 이름은 실패', async () => {
        recipeModel.searchRecipeByName.mockResolvedValue({ name: 'a' });
        const result = await recipeService.newRecipe(recipe);

        expect(result).toBeEqual({ ok: false, message: '이미 같은 이름의 레시피가 있습니다. '});
    });

    test('레시피 생성 성공시 id 반환', async () => {
        recipeModel.searchRecipeByName.mockResolvedValue(undefined);
        const result = await recipeService.newRecipe(recipe);

        expect(result).toBeEqual({ ok: true, id: 1});
    });
});