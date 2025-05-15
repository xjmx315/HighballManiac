//recipeP.js

/* 레시피 데이터 테이블 구조
레시피:
제작자 id - 제작법을 올린 사람의 아이디. int
포함되는 item id list - 어떤 재료료 구성되는지. int[]
테그 list - 깔끔함, 달달함, 트로피컬 등 테그 id list. int[]
+
id - 레시피의 pk. int
이름 - . string
사진 - url. string
단계 list - 제작법 설명이 담긴 list. 
    단계:
    제작법 사진 - url. string
    제작법 설명 - . string
    필요한 재료 id - . int[]
도수 - 알콜 함류량. int
생성일 - . date
*/

const getItems = (recipeStepDs) => {
    //TODO: item id 중복 없이 리스트 만들어서 리턴하기. 
    const items = [];
    for (const step of recipeStepDs) {
        items.push(...step.items);
    }
    return items;
};

const getRecipeD = (id, name, picUrl, recipeStepDs, alc, creat_at, creater, tags) => {
    const items = getItems(recipeStepDs);
    return {id, name, picUrl, items, recipeStepDs, creat_at, alc, creater, tags};
};

export default getRecipeD;