//recipeAPI.test.js

import app from "../../src/app.js";
import request from "supertest";
import CommonResponse from "../../src/prototype/commonResponse.js";
import dotenv from 'dotenv';

import db from "../../src/models/db.js";

dotenv.config();

describe("/recipe (post)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    let token = '';

    beforeAll(async () => {
        //인증 토큰 취득
        const result = await request(app)
            .post('/api/user/login')
            .send({
                name: 'admin',
                password: process.env.ADMINPW
            });
        if (!result.body.ok){
            console.error('토큰 취득에 실패했습니다. ')
        };
        token = result.body.data.token;
    });

    const recipeSample = { 
        "name":  "진 피즈",
        "discription": "탄산수, 레몬주스, 설탕이 들어간 유명한 칵테일. ",
        "recipe": "1. 셰이커에 탄산수를 제외한 주재료를 얼음과 함께 넣고 잘 흔들어준다.\n2. 얼음을 걸러내 텀블러 글라스에 따라준다. 이때 텀블러 글라스에 얼음은 넣지 않는다.\n3. 약간의 탄산수를 부어서 채워준다.\n4. 레몬 슬라이스와 원한다면 레몬 제스트로 가니쉬해준다.",
        "image": "",
        "alcohol": 13,
        "tags": [],
        "items": [6],
        "ingredients": [3, 6, 5, 7],
    };

    test("새로운 레시피 작성 - 인증 토큰 누락", async () => {
        const result = await request(app)
            .post("/api/recipe")
            .send(recipeSample);

        expect(result.status).toBe(401);
        expect(result.body).toEqual(new CommonResponse(false, 401, "인증 토큰이 필요합니다. (authorization 헤더를 포함해야 합니다.)"));
    });

    test("새로운 레시피 작성 - 토큰 인증 실패", async () => {
        const result = await request(app)
            .post("/api/recipe")
            .set('Authorization', 'Bearer invalidtoken123')
            .send(recipeSample);

        expect(result.status).toBe(401);
        expect(result.body).toEqual(new CommonResponse(false, 401, "인증 토큰이 유효하지 않습니다. "));
    });

    test("새로운 레시피 작성 - 필수 항목 누락", async () => {
        const errorRecipe = JSON.parse(JSON.stringify(recipeSample));
        delete errorRecipe.name;

        const result = await request(app)
            .post("/api/recipe")
            .set('Authorization', `Bearer ${token}`)
            .send(errorRecipe);

        expect(result.status).toBe(400);
        expect(result.body).toEqual(new CommonResponse(false, 400, `필드 '${'name'}'이(가) 누락되었습니다. `));
    });

    test("새로운 레시피 작성 - 정상 작성", async () => {
        const result = await request(app)
            .post("/api/recipe")
            .set('Authorization', `Bearer ${token}`)
            .send(recipeSample);

        expect(result.body).toEqual(new CommonResponse().setCode(201).setData({ id: 1 }));
        expect(result.status).toBe(201);
    });

    afterAll(async () => {
        await db.end();
    });
});