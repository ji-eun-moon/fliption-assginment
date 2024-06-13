# 플립션 소프트웨어 엔지니어 과제 전형

### 요구사항

- JWT 기반 인증 서버 구축하기

### 개발 환경

- Framework: NestJS
- Language: TypeScript
- Database: Postgresql
- ORM: Prisma
- API Interface: Swagger

### 설치 및 실행

```bash
git clone https://github.com/ji-eun-moon/fliption-assginment.git

npm install

docker-compose up

npm run db:push

npm run start
```

`.env`

```bash
HOST=http://localhost:3000

DATABASE_URL="postgresql://[USERNAME]:[PASSWORD]@localhost:5432/[DATABASE]"

JWT_SECRET=your_jwt_secret

DEFAULT_USER_USERNAME=username
DEFAULT_USER_PASSWORD=password
```

### 구현 사항

- 회원가입 및 로그인/로그아웃 API 를 구현하였습니다.
  - 기능 확인을 위한 사용자 조회/검색 API 를 추가로 구현하였습니다.
- JWT 를 활용한 쿠키 기반 인증을 구현하였습니다.
- 로그인한 유저만 접근할 수 있는 리소스에 사용하는 Guard 및 Decorator 를 구현하였습니다.
- 비로그인한 유저/로그인한 유저 모두 접근할 수 있는 리소스에 사용하는 Guard 및 Decorator 를 구현하였습니다.
