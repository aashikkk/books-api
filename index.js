const express = require('express'); // Import express

const app = express(); // We have created the object call app in express

app.use(express.json()); //bind this app to json

const books = [
    {"title": "Java Programming", id: 1},
    {"title": "C# Programming", id: 2},
    {"title": "NodeJS Programming", id: 3},

] //Create the array of books


app.get('/', (req, res)=>{
    res.send("Welcome to Automation Program")
});
//get data from server for home page with that msg

app.get('/api/books',(req,res) =>{
    res.send(books)
});
// return all books data

app.get('/api/books/:id',(req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id))
    if(!book) res.status(404).send('books not found')
    res.send(book)
});
// GET Books by ID. the id which is requested chnaged to integer . thats b.id. Thats saved in book object

app.post('/api/books/addBook', (req, res) => {
    const book = {
        id: books.length+1,
        title: req.body.title
    }
    books.push(book)
    res.send(book)
});
// You must type the title in body(raw) of postman in JSON format. ID will automatically incremented. that object will push to books.
// and that data come from server after added.  run time only

app.put('/api/books/:id',(req,res) => {
    const book = books.find(b => b.id === parseInt(req.params.id))
    if(!book) res.status(404).send("books not found")
    
    book.title = req.body.title
    res.send(book)
});
// UPDATE book by id. run time only

app.delete('api/books/:id', (req,res) => {
    const book = books.find(b => b.id === parseInt(req.params.id))
    if(!book) res.status(404).send("books not found")
    const index = books.indexOf(book)
    books.splice(index, 1)
    res.send(book)
});
// delete book by id. run time only

app.listen(8080); //bind with server 
