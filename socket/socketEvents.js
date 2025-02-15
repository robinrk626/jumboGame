const { joinSession, startGameIfOpponentAvailable, saveUserResponse, endUserSession } = require('./socket.helper');
const { Server } = require('socket.io');

const connectSocket = (app) => {
  const socketClient = new Server(app, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });
  global.socketClient = socketClient;

  socketClient.on('connect', (socket) => {
    socket.on('joinSession', async ({ sessionId }) => {
      const { userId } = await joinSession({ sessionId });
      socket.data = {
        sessionId, userId,
      };
      socket.join(sessionId);
      await startGameIfOpponentAvailable({ userId, sessionId });
    });

    socket.on('submit', async ({ gameId, optionId, questionId }) => {
      const {
        userId, sessionId,
      } = socket.data;
      await saveUserResponse({
        gameId, optionId, userId, sessionId, questionId,
      });
    });

    socket.on('disconnect', async () => {
      const { sessionId } = socket.data;
      await endUserSession({ sessionId });
      socket.leave(sessionId);
    })

  })
}

module.exports = {
  connectSocket,
}; 1