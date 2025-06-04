//commonResponse.js

class CommonResponse {
    constructor(ok = true, code = 200, message = "succeed", data = {}) {
        this.ok = ok;
        this.code = code;
        this.message = message;
        this.data = data;
    }

    setOk(ok) {
        this.ok = ok;
        return this;
    }

    setCode(code) {
        this.code = code;
        return this
    }

    setMessage(message) {
        this.message = message;
        return this;
    }

    setData(data){
        this.data = data;
        return this;
    }       
}

export default CommonResponse;