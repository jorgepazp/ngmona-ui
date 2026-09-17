FROM node:22.22.3 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM node:22.22.3-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist/ui-kit/browser ./dist

EXPOSE 80

CMD ["serve", "-s", "dist", "-l", "80"]