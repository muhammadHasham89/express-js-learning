const express = require('express') // dependency
const app = express() // initiate object

// create connection with port 3000
app.listen(3000, ()=> {
    console.log(`Project is running on port 3000`)
})

// declare routes 

app.get('/', (req, res) => {
    res.send('Hello Node + Express App');
})