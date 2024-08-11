const express = require('express');
const http = require('http');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",  // This should match the URL of your frontend
      methods: ["GET", "POST"],
      credentials: true
    }
  });


const mongoose = require('mongoose');
const User = require('./models/User');


mongoose.connect('mongodb://localhost:27017/catan')
.then(() => {
    console.log('MongoDB connected...');
}).catch((err) => {
    console.log('MongoDB connection error:', err);
});


const PORT = process.env.PORT || 5001;
const cors = require('cors');
const GamesFactory = require('./GamesFactory');



app.use(cors());
app.use(express.static('public'));
app.use(express.json());

//let game = new Game(2) //SHOULD BE AN ARRAY OF GAMES
let gf = new GamesFactory();
//let game = gf.createGame(2)
let games = {}


function notifyTurnChanged(game) {
    io.emit('turnEnded', {
        turn: game.getTurn(),
    });
}

function notifyPlayerOffer(data) {
    console.log("notifyPlayerOffer")
    io.emit('playerOffer', {
        offer: {        
            offerAmount : data.offerAmount,
            requestAmount : data.requestAmount,
            offerResource : data.offerResource,
            requestResource : data.requestResource
        }

    });
}

const listSocketsInRoom = (room) => {
    const roomDetails = io.sockets.adapter.rooms.get(room);
    if (roomDetails) {
        console.log(`Sockets in room ${room}: ${Array.from(roomDetails).join(', ')}`);
    } else {
        console.log(`No sockets in room ${room}`);
    }
};


io.on('connection', (socket) => {
    
    console.log('A user connected with ID:', socket.id);
    //game.setPlayerSocket(socket.id)

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });

    // Receiving a message and determining whether to broadcast or send to a specific client
    socket.on('sendMessage', ({ message, targetId, gameId }) => {
        console.log(`Received message from ${socket.id} to ${targetId}: ${message}`);
        if (targetId === 'broadcast') {
            // Broadcast to all clients except the sender
            //socket.broadcast.emit('receiveMessage', { message: message, from: socket.id });
            console.log("gameId", gameId)
            io.in(gameId).emit('receiveMessage', { message: message, from: socket.id });

        } else {
            // Send to a specific client
            io.to(targetId).emit('receiveMessage', { message: message, from: socket.id });
        }
    });

        // On client choosing to join a game
    /*socket.on('joinGame', ({gameId}) => {
        socket.join(gameId);
        console.log(`Current rooms for ${socket.id}:`, socket.rooms);  // This will log all rooms this socket is a part of

        // Additional logic to handle game state initialization or joining
    });
*/
    // On client choosing to create a game
    socket.on('gameCreated', (gameId) => {
        socket.join(gameId);
        console.log(`Socket ${socket.id} joined game ${gameId}`);
        console.log("gameId", gameId)
        listSocketsInRoom(gameId)
        let game = games[gameId]

        if (game) {
            game.setPlayerSocket(socket.id)
        }

        socket.emit('gameCreated', gameId);
    });
});

app.post('/createGame', (req, res) => {
    try {

        const game = gf.createGame(2);
        
        // Store the game with an ID
        const gameId = game.getId(); // Assuming each game has a unique ID property

       // console.log("gameId createGame", gameId)
        games[gameId] = game;
       // console.log("games createGame", games)
        res.json({gameId});
    } catch (error) {
        console.error("Error fetching tiles from gameMap:", error);
        res.status(500).send("Failed to retrieve tiles.");
    }
});

app.post('/joinGame', (req, res) => {
    try {
        let gameId = req.query.joinGameId;
        //console.log("gameId", gameId)
        let game = games[gameId]
        /*console.log("games", games)
        console.log("game", game)
        console.log("game.id", game.getId())
        console.log("gameId", gameId)
        */
        gameId = game.getId()
        if (game) {
            res.json({gameId});
        } else {
            res.json(null);
        }
    } catch (error) {
        console.error("Error fetching tiles from gameMap:", error);
        res.status(500).send("Failed to retrieve tiles.");
    }
});

app.get('/tiles', (req, res) => {
    try {
        const gameId = req.query.gameId; // Correctly accessing gameId from query parameters
        //console.log("req.gameId:", gameId)
        //const tilesData = games[gameId].getTiles();
        //console.log("games", games)
        let game = games[gameId]


        const tilesData = game.getTiles();

        //const tilesData = game.getTiles();
        res.json({tiles: tilesData});
    } catch (error) {
        console.error("Error fetching tiles from gameMap:", error);
        res.status(500).send("Failed to retrieve tiles.");
    }
});

app.get('/boardState', (req, res) => {
    try {

        const gameId = req.query.gameId; // Correctly accessing gameId from query parameters
        let game = games[gameId]

        const boardState = game.getBoardState()
       // console.log(boardState)
        res.json(boardState);
    } catch (error) {
        console.error("Error fetching tiles from gameMap:", error);
        res.status(500).send("Failed to retrieve tiles.");
    }
});

app.post('/notify', (req, res) => {

    const gameId = req.query.gameId; // Correctly accessing gameId from query parameters
    let game = games[gameId]
    /*console.log("gameId in notify", gameId)
    console.log("game in notify", game)
    console.log("games", games)
    */


    const { command, ...payload } = req.body; // Destructure to separate command and the rest of the payload
    /*console.log("req.body:", req.body)
    console.log("command:", command)
    console.log("payload:", payload)
*/



    try {
        //const data = gm.handleInputFromClients(command, payload);
        const data = game.getGameManager().handleInputFromClients(command, payload);
        //console.log("data:", data)
        if (data.success && command === "endTurn") {
            notifyTurnChanged(game)
        }
        else if (data.success && command === "submitOfferToOtherPlayer") {
            console.log("submitOfferToOtherPlayer")
            notifyPlayerOffer(data)
        }
        //console.log("data:", data)
        res.json(data); // Send JSON response with data processed
    } catch (error) {
        console.error('Error handling notification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Registration route
app.post('/register', async (req, res) => {
    console.log("Received a registration request");
    const users = await User.find({});
    console.log("Current users in the database:", users);

    const { username, password } = req.body;
    console.log("Username:", username);
    console.log("Password:", password);

    try {
        const newUser = new User({ username, password });
        await newUser.save();
        console.log("New user registered successfully:", newUser);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
});


// Define other routes and middleware
app.post('/login', handleLogin);

/*async function handleLogin(req, res) {
    const { username, password } = req.body;

    console.log("username", username)
    console.log("password", password)

    // Simulate database check or any asynchronous operation
    try {
        if (true) {
            res.status(200).json({ message: "Login successful", token: "your_generated_token_here" });
            // The token should be a JWT or similar token issued for valid logins
        } else {
            res.status(401).json({ message: "Login failed: Invalid username or password" });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
}*/

async function handleLogin(req, res) {
    const { username, password } = req.body;

    console.log("username", username);
    console.log("password", password);

    const users = await User.find({});
    console.log("users:", users)

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        console.log(user)

        // Check if user exists
        if (!user) {
            return res.status(401).json({ message: "Login failed: Invalid username or password" });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch)
        // If the password does not match
        if (!isMatch) {
            return res.status(401).json({ message: "Login failed: Invalid username or password" });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        console.log("found user")
        // Send the token to the client
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
}


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
