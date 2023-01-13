/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const express = require('express'); //imports express package and saves it to a variable called express
const app = express(); //saves the result of calling the express function to a variable called app
const MongoClient = require('mongodb').MongoClient;//imports Mongo client package and saves it to a variable called MongoClient
const PORT = 2122; //denotes the port that will be accessed on the server
require('dotenv').config(); //imports dotenv package and calls its config method


let db, //initializes variable called db
    dbConnectionStr = process.env.DB_STRING, //assigns the connection string to a variable called dbConnectionStr
    dbName = 'todo'; //creates a variable called dbName to store the name of the database

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connects to the database and truly uses unified topology
    .then(client => {
        console.log(`Connected to ${dbName} Database`); //logs this message to the console to alert the user as to which database they have connected to
        db = client.db(dbName); //assigns the db variable to the name of the currently connected mongodb
    });

app.set('view engine', 'ejs'); //setting the view render engine to be ejs
app.use(express.static('public')); //sets the static folder for assets to be automatically served from as named public
app.use(express.urlencoded({ extended: true }));//receiving data as a string or array from an html <form> tag
app.use(express.json());//use json in express to be able to recieve data in json


app.get('/',async (request, response) => { //GET response for the home route
    const todoItems = await db.collection('todos').find().toArray(); //creates an array of the todoItems stored in the collection and stores it in a variable called todoItems
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false }); //creates a variable that stores the number of uncompleted items
    response.render('index.ejs', { items: todoItems, left: itemsLeft }); //creates an HTML and passes in the array of items along with the number of uncompleted items
    // db.collection('todos').find().toArray() // the same thing as above, just done by promise chaining syntax instead of async await
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
});

app.post('/addTodo', (request, response) => { //POST response for adding an item to the collection made on the /addTodo route
    db.collection('todos').insertOne({ thing: request.body.todoItem, completed: false }) //adds the first uncompleted item to the 'todos' collection
        .then(result => {
            console.log('Todo Added'); //logs this message to the console to alert the user that they have added the current Todo has been added
            response.redirect('/'); //goes back to the home route to force an update/refresh
        })
        .catch(error => console.error(error));//catch errors in the post response or request
});

app.put('/markComplete', (request, response) => { //PUT response for marking an item as completed made on the /markComplete route
    db.collection('todos').updateOne({ thing: request.body.itemFromJS },{ //updates the item from mongo that matches the request todo
        $set: { //uses mongo set to update an object
            completed: true //marks completed property as true
        }
    },{
        sort: { _id: -1 }, //sorts results in descending order
        upsert: false //does not insert if no update
    })
        .then(result => {
            console.log('Marked Complete'); //logs this message to the console to alert the user that they have added the current Todo has been marked complete
            response.json('Marked Complete'); //sends a json response when todo marked complete
        })
        .catch(error => console.error(error)); //logs error

});

app.put('/markUnComplete', (request, response) => { //PUT response for marking an item as uncompleted made on the /markUnComplete route
    db.collection('todos').updateOne({ thing: request.body.itemFromJS },{ //updates the item from mongo that matches the request todo
        $set: { //uses mongo set to update an object
            completed: false //marks completed property as false
        }
    },{
        sort: { _id: -1 }, //sorts results in descending order
        upsert: false //does not insert if no update
    })
        .then(result => {
            console.log('Marked Complete'); //logs this message to the console to alert the user that they have added the current Todo has been marked uncompleted
            response.json('Marked Complete'); //sends a json response when todo marked uncompleted
        })
        .catch(error => console.error(error)); //logs error

});

app.delete('/deleteItem', (request, response) => { //DELETE response for deleting an item made on the /deleteItem route
    db.collection('todos').deleteOne({ thing: request.body.itemFromJS }) //parses body and deletes todo from mongo
        .then(result => {
            console.log('Todo Deleted'); // logs todo deleted to console
            response.json('Todo Deleted'); //sends a json response when todo deleted
        })
        .catch(error => console.error(error)); //logs error

});

app.listen(process.env.PORT || PORT, () => { // use PORT or a designated port
    console.log(`Server running on port ${PORT}`); // checking on the server to see if its running
});