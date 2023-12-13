const express = require('express'); // dependency
const app = express() // initiate object
const mongoose = require('mongoose');
const User = require('./models/userModels');
// jwt
const jwt = require('jsonwebtoken');
const tokenSecrate = '313019c47a728541248c60b95a9e97ae53d4de621fd926ebd8bfb5a589ced73de15adcac5187534c6bc3ad138a000dae34cc1845bd25478853afd825c80f0477';

// use middleware to parse request
app.use(express.json())
// to support form post
app.use(express.urlencoded({extended: true}))


// create connection with port 3000
app.listen(3000, ()=> {
    console.log(`Project is running on port 3000`)
})


app.post('/login', async (req, res) => {
    const user = await User.find({
        email: req.body.email,
        password: req.body.password
    });

    if(user.length > 0){
        const token = generateAccessToken({id: user[0]._id});
        res.status(200).json({
            message: "Login Successfully",
            token: token
        });

    }else{
        res.status(404).json({message: "User not found"});
    }
});

app.get('/users', authenticateToken, async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    }catch (error){
        res.status(500).json({error : error.message})
    }
})

// get user detail by id
app.get('/user/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    }catch (error){
        res.status(500).json({error : error.message})
    }
});

// async used for db insertion dependency for await
app.post('/user', async(req, res) => {
    try{
        // await used for database interaction
         const user = await User.create(req.body);
         res.status(200).json(user);
    }catch(error){
        console.log(error.message);
        res.status(500).json({message: error.message})

    }
})

// update user
app.put('/user/:id', authenticateToken, async (req, res) => {
    try{
        //update user
        const {id} = req.params;
        const user = await User.findByIdAndUpdate(id, req.body);

        // in case user not found
        if(!user) {
            res.status(404).json({message: "User not found"});
        }

        // if user found
        const updatedUser = await User.findById(id)
        res.status(200).json(updatedUser);
    }catch(error){
        console.log(error.message);
        res.status(500).json({message: error.message})

    }
});

// delete user
app.delete('/user/:id', async (req, res) => {
    try{
        //update user
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id);
        res.status(200).json({message: "User deleted successfully"});
    }catch(error){
        res.status(500).json({message: error.message})
    }
});


function generateAccessToken(userId){
    return jwt.sign(userId, tokenSecrate, {expiresIn: '1800s'});
}
// verify token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401).json({message: "Unauthorized"});

    jwt.verify(token, tokenSecrate, (err, user) => {
        console.log(err);
        if (err) return res.sendStatus(403).json({message: "Forbidden"});

        req.user = user;

        next();
    });
}

mongoose.set("strictQuery", false);
// connnect with mongo with mongoose
mongoose.connect('mongodb+srv://muhammadhasham:DW90vLi3i4eq4DA8@mongodbapp.gkarvc1.mongodb.net/Node-API?retryWrites=true&w=majority').then(() => {
    console.log("Mongo connected successfully")
}).catch((error) => {
    console.log(error)
});