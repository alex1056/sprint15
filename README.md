
# Term paper, sprint 14

## Implementation of authentication and authorization in the REST API server 'Mesto'.


**The following queries work with access rules:**

- **GET localhost:3000/users**
- **GET localhost:3000/users/userId**
- **POST localhost:3000/users/users**
- **PATCH localhost:3000/users/me**
- **PATCH localhost:3000/users/me/avatar**
- **GET localhost:3000/cards**
- **POST localhost:3000/cards**
- **DELETE localhost:3000/cards/cardId**
- **PUT localhost:3000/cards/cardId/likes**
- **DELETE localhost:3000/cards/cardId/likes**
- **Wrong URLs return status 404**

**The following queries work in free access:**

- **POST localhost:3000/signin**
- **POST localhost:3000/signup**

## Installation:

### Dependencies:

`npm install`

### Configured two build modes:

**Production:**
`npm run start`

**Development:**
`npm run dev`

