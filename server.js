const express = require('express'); // dependency
const app = express() // initiate object
const mongoose = require('mongoose');
const User = require('./models/userModels');

// use middleware to parse request
app.use(express.json())

// create connection with port 3000
app.listen(3000, ()=> {
    console.log(`Project is running on port 3000`)
})


app.get('/', (req, res) => {
    res.send('Hello World');
    console.log('Hello');
})

app.get('/users', async (req, res) => {
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
app.put('/user/:id', async (req, res) => {
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

mongoose.set("strictQuery", false);
// connnect with mongo with mongoose
mongoose.connect('mongodb+srv://muhammadhasham:DW90vLi3i4eq4DA8@mongodbapp.gkarvc1.mongodb.net/Node-API?retryWrites=true&w=majority').then(() => {
    console.log("Mongo connected successfully")
}).catch((error) => {
    console.log(error)
});