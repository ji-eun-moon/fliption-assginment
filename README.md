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
