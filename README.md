# Highball Maniac

> 내가 가진 재료를 기만으로 만들 수 있는 하이볼을 검색할 수 있었으면 좋겠다!

Highball Maniac은 재료, 태그 기반 하이볼 레시피를 제공하는 1인 개발 서비스 입니다.
Express 기반의 서버로 API를 제공합니다. 

[FE 바로가기](https://github.com/xjmx315/highball-maniac)

## API LIST

모든 api는 '/api' 경로 아래에서 제공됩니다. 

### User

|경로|메소드|인자|내용|
|---|---|---|---|
|**/user/join**|POST|body: email, password, name|새로운 유저를 생성합니다. |
|**/user/login**|POST|body: password, name|로그인을 시도하고 로그인 토큰을 반환합니다. |
|**/user**|GET|query: name|사용자 프로필을 조회합니다. |
|**/user/tokenCheck**|GET|header: authorization|토큰 유효성을 확인합니다. |
|**/user**|DELETE|body: password|사용자 계정을 삭제합니다. |
|**/user/search/:name**|GET|param: name|이름으로 사용자를 검색합니다. |

### Item

|경로|메소드|인자|내용|
|---|---|---|---|
|**/item**|GET|-|모든 아이템 목록을 조회합니다. |
|**/item/search**|GET|query: name|이름으로 아이템을 검색합니다. |

### Ingredient

|경로|메소드|인자|내용|
|---|---|---|---|
|**/ingredient/search**|GET|query: name|이름으로 재료를 검색합니다. |
|**/ingredient**|GET|query: id|ID로 재료를 조회합니다. |

### Recipe

|경로|메소드|인자|내용|
|---|---|---|---|
|**/recipe**|POST|body: name, description, recipe, alcohol, ingredients, items, tags / header: authorization|새로운 레시피를 생성합니다. |
|**/recipe/:id**|GET|param: id|ID로 레시피를 조회합니다. |
|**/recipe/search**|GET|query: name|이름으로 레시피를 검색합니다. |
|**/recipe/newest**|GET|-|최신 레시피를 조회합니다. |
|**/recipe/random**|GET|-|랜덤 레시피를 조회합니다. |
|**/recipe/ingredients/:id**|GET|param: id|레시피에 포함된 재료를 조회합니다. |
|**/recipe/writtenby/:id**|GET|param: id|특정 사용자가 작성한 레시피를 조회합니다. |
|**/recipe/including**|GET|query: items|특정 아이템을 포함한 레시피를 검색합니다. |

### Recipe Tag

|경로|메소드|인자|내용|
|---|---|---|---|
|**/recipe/tag**|POST|body: recipeId, tagId / header: authorization|레시피에 태그를 추가합니다. |
|**/recipe/tag**|DELETE|body: recipeId, tagId / header: authorization|레시피에서 태그를 삭제합니다. |
|**/recipe/tag**|PUT|body: recipeId, tagList / header: authorization|레시피의 태그를 일괄 설정합니다. |
|**/recipe/tag/:id**|GET|param: id|레시피의 태그 목록을 조회합니다. |

### Tag

|경로|메소드|인자|내용|
|---|---|---|---|
|**/tag**|GET|query: name|이름으로 태그를 검색합니다. |
|**/tag/id/:id**|GET|param: id|ID로 태그를 조회합니다. |
|**/tag/recipe/:id**|GET|param: id|특정 태그가 포함된 레시피를 조회합니다. |
|**/tag/all**|GET|-|모든 태그 목록을 조회합니다. |

### Admin

|경로|메소드|인자|내용|
|---|---|---|---|
|**/admin/db/init**|GET|body: adminPassword|데이터베이스를 초기화합니다. |
|**/admin/db/export/:tableName**|GET|param: tableName|테이블 데이터를 CSV로 내보냅니다. |
|**/admin/db/update/:tableName**|POST|param: tableName, body: file|CSV 파일로 테이블 데이터를 업데이트합니다. |
|**/admin/db/delete/:tableName**|GET|param: tableName|테이블의 모든 데이터를 삭제합니다. |

## 주요 기술 스택

### Backend Framework
- **Express.js** - Node.js 웹 애플리케이션 프레임워크
- **ES6+ Modules** - 최신 JavaScript 모듈 시스템 활용

### Database
- **MySQL** - 관계형 데이터베이스
- **mysql2** - Promise 기반 MySQL 클라이언트

### Authentication & Security
- **JWT** - 토큰 기반 인증
- **bcryptjs** - 비밀번호 해싱
- **CORS** - 교차 출처 리소스 공유 설정

### File Handling
- **Multer** - 파일 업로드 처리
- **CSV Parser** - CSV 파일 읽기/쓰기
- **json2csv** - JSON을 CSV로 변환

### Development & Testing
- **Jest** - 테스트 프레임워크
- **Supertest** - HTTP 테스트
- **Babel** - ES6+ 코드 변환
- **dotenv** - 환경 변수 관리

## 아키텍처 구조

### 계층형 아키텍처
```
┌─────────────────┐
│   Controllers   │ ← HTTP 요청/응답 처리
├─────────────────┤
│    Services     │ ← 비즈니스 로직
├─────────────────┤
│     Models      │ ← 데이터 접근 계층
├─────────────────┤
│   Database      │ ← MySQL 데이터베이스
└─────────────────┘
```

## 핵심 기능

### 1. 사용자 관리
- 회원가입/로그인 (JWT 인증)
- 프로필 조회/수정
- 사용자 검색

### 2. 레시피 시스템
- 레시피 CRUD 작업
- 태그 기반 분류
- 재료별 검색
- 최신/랜덤 레시피 조회

### 3. 태그 시스템
- 레시피별 태그 연결
- 태그 기반 검색

### 4. 재료 관리
- 아이템과 재료 분리 관리
- 재료별 검색
- CSV 기반 데이터 관리

### 5. 관리자 기능
- 데이터베이스 초기화
- CSV 파일을 통한 데이터 업데이트
- 테이블 데이터 내보내기/삭제

## 기술적 특징

### 1. 체이닝 패턴을 활용한 미들웨어
```javascript
// ensureParams 미들웨어의 체이닝 패턴
// 유연하고 가독성 높은 파라미터 검증
const numberIdOnParam = ensureParams()
    .onParam(['id'])
    .shouldNumber(['id'])
    .build();

const complexValidation = ensureParams()
    .onBody(['recipeId', 'tagList'])
    .onQuery(['page', 'limit'])
    .shouldNumber(['recipeId', 'page', 'limit'])
    .build();
```

### 2. 공통 응답 형식
```javascript
// 일관된 API 응답 구조
class CommonResponse {
    constructor(ok = true, code = 200, message = "succeed", data = {})
}

// 체이닝 메서드를 통한 유연한 응답 구성
const response = new CommonResponse()
    .setCode(201)
    .setMessage("레시피가 성공적으로 생성되었습니다.")
    .setData({ id: recipeId });
```

### 3. 비동기 처리 최적화
```javascript
// Promise.all을 활용한 병렬 처리로 성능 향상
const deleteProcess = tagListFrom
    .filter(item => !toSet.has(item))
    .map(item => deleteFunc(recipeId, item));

const addProcess = tagListTo
    .filter(item => !fromSet.has(item))
    .map(item => addFunc(recipeId, item));

await Promise.all([...deleteProcess, ...addProcess]);
```

### 4. 데이터베이스 자동 초기화
- 데이터베이스 연결 실패 시 자동 스키마 생성
- 연결 풀링을 통한 성능 최적화
- 스트림 기반 CSV 파일 처리로 대용량 데이터 처리

### 5. 환경별 설정 분리
- 개발/운영 환경에 따른 CORS 설정
- 환경 변수를 통한 설정 관리

### 6. 스트림 기반 파일 처리
```javascript
// 대용량 CSV 파일을 메모리 효율적으로 처리
const source = createReadStream(filePath, 'utf8');
const parser = csv();
source.pipe(parser);

parser.on('data', async (row) => {
    // 각 행을 개별적으로 처리하여 메모리 사용량 최적화
    await processRow(row);
});
```

### 7. 체계적인 에러 처리
```javascript
// 미들웨어 체인을 통한 중앙화된 에러 처리
app.use((req, res, next) => {
    const err = new Error(`Not Found: ${req.method} ${req.originalUrl}`);
    err.status = 404;
    next(err);
});

app.use(errorHandler); // 커스텀 에러 핸들러
```

## 데이터베이스 설계

### 주요 테이블
- **users** - 사용자 정보
- **recipes** - 레시피 정보
- **items** - 칵테일 아이템
- **ingredients** - 재료 정보
- **tags** - 태그 정보
- **recipes_tags** - 레시피-태그 연결
- **recipes_items** - 레시피-아이템 연결
- **recipes_ingredients** - 레시피-재료 연결

### 관계형 설계
- 외래 키 제약 조건을 통한 데이터 무결성 보장
- CASCADE 삭제를 통한 연관 데이터 자동 정리
- 인덱스를 통한 검색 성능 최적화

## 테스트

### 테스트 환경
- **Jest** 프레임워크 기반
- **Babel** 설정을 통한 ES6+ 지원
- **Supertest**를 통한 HTTP API 테스트

### 테스트 실행
```bash
# 전체 테스트 실행
npm test

# 특정 테스트 파일 실행
npm test __test__/api/recipeAPI.test.js
```

## 보안

- **JWT 토큰 인증** - 안전한 사용자 인증
- **비밀번호 해싱** - bcrypt를 통한 보안 강화
- **CORS 설정** - 허용된 도메인만 접근 가능
- **입력 검증** - 미들웨어를 통한 파라미터 검증

## 성능 최적화

- **데이터베이스 연결 풀링** - 연결 재사용
- **비동기 처리** - Promise 기반 비동기 작업
- **인덱스 활용** - 검색 쿼리 성능 향상
- **스트림 처리** - 대용량 CSV 파일 처리
