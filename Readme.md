## OverView
This backend project is for creating user-account (login, register), creating questions, authenticating user and playing game.
Deliver real time question to user, when both user submit the question and in the end calculate score and find winner.

## Tech Stack
- **Backend**: node js
- **Database**: Mongodb
- **Real time communication**: Socket
- **Authentication**: JWT

## Features
1: User register
  User can register with his mobile number. One account can be created per account.

2: User log in
  User can login to his account, by using number and password

3: User can create question

4: User can play game with other players

5: Real time communication

Setup:

install dependencies:

'npm i'

copy example.config.json and create a new file development.config.json
{
    "PORT": 3002,
    "database": {
        "username": "robingarg6626",
        "password": "2lnj0PP0Tz5cpySd",
        "databaseName": "atoz"
    },
    "redisConnection": {
        "port": 6379,
        "hostname": "localhost"
    },
    "jwt": {
        "secret": "iiuuyytre"
    }
}

start the server

npm run start

## API end points

1. /login: To login in existing account
2. /register: to create a new account
3. /auth/questions: to create questions
4. /auth/game/start: to start game session

socket event:
init: notify players they find opponent and game is going to start
questionSend: send next question, when both user will submit the question
end: when game is finish and to announce result

