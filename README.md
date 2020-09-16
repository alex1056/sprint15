# Учебное задание "Спринт 15"

REST API приложение для работы фронтенда.

**Технологии:**

- JavaScript,
- Express,
- MongoBD,
- Node.js,
- Joi-Celebrate - валидация полей,
- Winston - логирование запросов.

**Функциональность:**

- signin,
- signup,
- сохранение карточки,
- удаление карточки,
- получение всех карточек пользователя,
- изменение информации о пользователе.

**В API реализованы следующие запросы:**

> - GET localhost:3000/users
> - GET localhost:3000/users/userId
> - POST localhost:3000/users/users
> - PATCH localhost:3000/users/me
> - PATCH localhost:3000/users/me/avatar
> - GET localhost:3000/cards
> - POST localhost:3000/cards
> - DELETE localhost:3000/cards/cardId
> - PUT localhost:3000/cards/cardId/likes
> - DELETE localhost:3000/cards/cardId/likes
> - Wrong URLs return status 404

Следующие запросы не защищены авторизацией:

> - POST localhost:3000/signin
> - POST localhost:3000/signup

### Dependencies:

`npm install`

### Configured two build modes:

**Production:**
`npm run start`

**Development:**
`npm run dev`
