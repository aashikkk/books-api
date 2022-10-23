const express = require('express')
const MongoClient = require('mongodb').MongoClient
const app = express()

const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')


app.use(express.json())
var database

const options = {
    definition: {
        openapi: '3.0.0',
        info : {
            title: 'Node JS API Project for MongoDB',
            version: '1.0.0'
        },
        servers:  [
            {
                url: 'http://localhost:8080/'
            }
        ]
    },
    apis: ['./mongodb.js']
}

const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

/**
 * @swagger
 * /:
 *  get:
 *      summary: (S) This is used to check if get method is working or not
 *      description: (des) This is used to check if get method is working or not
 *      responses:
 *          200:
 *              description: To test Get method
 */

app.get('/', (req,res) => {
    res.send("Welcome to MongoDB API")
})

/**
 * @swagger
 *  components:
 *      schemas:
 *          Book:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                  title:
 *                      type: string
 */

/**
 * @swagger
 * /api/books:
 *  get:
 *      summary: /api/books  To get all books from MongoDB
 *      description: this api is used to fetch data from MongoDB
 *      responses:
 *          200: 
 *              description: this api is used to fetch data from MongoDB
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Book'
 */

app.get('/api/books/', (req,res) => {
    database.collection('books').find({}).toArray((err, result) => {
        if(err) throw err
        res.send(result)
    })
})

/**
 * @swagger
 * /api/books/{id}:
 *  get:
 *      summary: To get books by id from MongoDB
 *      description: this api is used to fetch specific data from MongoDB
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Numeric ID required
 *            schema:
 *               type: integer
 *      responses:
 *          200: 
 *              description: this api is used to fetch specific data from MongoDB
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Book'
 */

app.get('/api/books/:id',(req, res) => {
   database.collection('books').find({id: parseInt(req.params.id)}).toArray((err, result) => {
    if(err) throw err
    res.send(result)
   })
})

/**
 * @swagger
 * /api/books/addBook:
 *  post:
 *      summary: used to insert data to MongoDB
 *      description: this api is used to fetch data from MongoDB
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema: 
 *                      $ref: '#components/schemas/Book'
 *                      
 *      responses:
 *          200: 
 *              description: Added Successfully                           
 */


app.post('/api/books/addBook', (req, res) => {
    let resp = database.collection('books').find({}).sort({id: -1}).limit(1)
    resp.forEach(obj => {
        if (obj){
            let book = {
                id: obj.id +1,
                title: req.body.title
            }
            database.collection('books').insertOne(book, (err, result) => {
                if(err) res.status(500).send(err)
                res.send("Added Successfully!")
            })
        }
    })
})

/**
 * @swagger
 * /api/books/{id}:
 *  put:
 *      summary: used to update data to MongoDB
 *      description: this api is used to update data from MongoDB
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Numeric ID required
 *            schema:
 *               type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema: 
 *                      $ref: '#components/schemas/Book'
 *                      
 *      responses:
 *          200: 
 *              description: Updated Successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Book'                           
 */

app.put('/api/books/:id', (req, res) => {
    let query = {id: parseInt(req.params.id)}
    let book = {
        id: parseInt(req.params.id),
        title: req.body.title
    }
    let dataSet = {
        $set: book
    }
    database.collection('books').updateOne(query, dataSet, (err, result) => {
        if(err) throw err
        res.send(book)
    })
})

/**
 * @swagger
 * /api/books/{id}:
 *  delete:
 *      summary: To delete book by id from MongoDB
 *      description: this api is used to delete specific data from MongoDB
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Numeric ID required
 *            schema:
 *               type: integer
 *      responses:
 *          200: 
 *              description: Data is deleted successfully
 */

app.delete('/api/books/:id', (req, res) => {
    database.collection('books').deleteOne({id: parseInt(req.params.id)}, (err, result) => {
        if(err) throw err
        res.send('Book is deleted')
    })
})

app.listen(8080, () => {
    MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true}, (error, result) => {
        if(error) throw error
        database = result.db('mydatabase')
        console.log('connection successful!')
    })
})