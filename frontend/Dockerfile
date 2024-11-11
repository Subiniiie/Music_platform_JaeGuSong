# 빌드 스테이지
FROM node:20-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사
COPY package*.json .

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 앱 실행 (예: npm start)
# RUN npm start

CMD ["npm", "run", "start"]
