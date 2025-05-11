//recipeStepP.js

/*
단계:
제작법 사진 - url. string
제작법 설명 - . string
필요한 재료 id - . int[]
*/

const getReciprStepD = (picUrl, content, items) => {
    if (!picUrl || !content || !items){
        return null;
    }

    return {picUrl, content, items};
};

export default getReciprStepD;