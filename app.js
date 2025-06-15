import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';

import MessageModel from './models/messageModel.js';
// import MatchModel from './models/matchModel.js';
import connectionMongoDB from './connectionMongoDB.js';

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});
const port = 3000;

connectionMongoDB();

app.use(express.static('public'));
app.use(cors({ origin: "http://localhost:5173" }));

//get from mongodb
app.get("/messages", async (req, res) => {
    try {
        const allMessages = await MessageModel.find();
        return res.status(200).json(allMessages);
    }
    catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});

// app.get("/matches", async (req, res) => {
//     try {
//         const allMatches = await MatchModel.find();
//         return res.status(200).json(allMatches);
//     }
//     catch (error) {
//         return res.status(500).json({
//             error: error.message
//         })
//     }
// });


io.on('connection', (socket) => {
    console.log(`A client with id ${socket.id} connected to the chat!`);
    socket.emit('hello', 'Hello from backend!');

    socket.on('chatMessage', msg => {
        console.log('Meddelanden: ' + msg.message);
        io.emit('newChatMessage', { user: msg.user, message: msg.message, messages: msg.messages });
        let today = new Date();
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = date + ' ' + time;
        let user = msg.user;
        let message = msg.message;

        // Sparar till MongoDB med Mongoose
        const newMessage = new MessageModel({ message: message, user: user, date: dateTime });
        newMessage.save();
    });

    socket.on('player', player => {
        console.log('got new player');
        io.emit('newPlayer', player);
    });

    socket.on('gameCreated', gameName => {
        console.log(gameName);
        io.emit('newGameCreated', gameName);
    })

    // socket.on('match', async (game) => {
    //     console.log(game)
    //     // add get to check if the gameName is unique or get the id?
    //     const newMatch = new MatchModel({ gameName: game.gameName, player1: { name: game.player1 }, player2: { name: game.player2 } });
    //     newMatch.save();
    // })

    socket.on('move', ({ index, symbol, players, board }) => {
        console.log('cell ', { index, symbol, players, board });
        io.emit('newMove', { index, symbol, players, board });
    });

    // socket.on('matchUpdate', async (win) => {
    //     const match = await MatchModel.findOne({ gameName: win.gameName });

    //     if (!match) return;

    //     let updatePath;
    //     if (match.player1.name === win.name) {
    //         updatePath = "player1.wins";
    //     } else if (match.player2.name === win.name) {
    //         updatePath = "player2.wins";
    //     } else {
    //         return;
    //     }

    //     await MatchModel.updateOne(
    //         { gameName: win.gameName },
    //         { $inc: { [updatePath]: 1, numberOfGames: 1 } }
    //     );
    // });

    // socket.on('matchEnd', async (gameName) => {
    //     console.log(gameName)
    //     try {
    //         await MatchModel.findOneAndUpdate(
    //             { gameName },
    //             { $inc: { numberOfGames: 1 } }
    //         );
    //     } catch (err) {
    //         console.error(`Failed to update numberOfGames for ${gameName}:`, err);
    //     }
    // });

    socket.on('boardReset', () => {
        io.emit('resetBoard');
    });

});


server.listen(port, '0.0.0.0', () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});