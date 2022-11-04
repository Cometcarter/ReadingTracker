const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
var morgan = require('morgan')
app.use(morgan('dev'))

var db, collection;

const url = "mongodb+srv://cometcarter:ikumi101@cluster0.seiom8q.mongodb.net/bookclubrec?retryWrites=true&w=majority";
const dbtitle = "bookclubrec";

app.listen(7000, () => {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
      throw error;
    }
    db = client.db(dbtitle);
    console.log("Connected to `" + dbtitle + "`!");
  });
});


//setting view engine to ejs
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))


//route for index page
app.get('/', (req, res) => {
  db.collection('bookrec')
    .find()
    .toArray((err, result) => {
      result.sort((a, b) => parseFloat(b.upVote) - parseFloat(a.upVote));
      if (err) return console.log(err)
      res.render('index.ejs', { bookrec: result })
    })
})

//event listener is calling this put vvvv
app.put('/favorite', (req, res) => {
  db.collection('bookrec').findOneAndUpdate({
    //filters vvv
    author: req.body.author,
    title: req.body.title
  }, {
    $set: {
      favorite: req.body.favorite
    }
  }, (err, result) => {
    if (err) return console.log(err)
    console.log(result)
    res.send('ok')
  })
  // res.render('favorite.ejs')
  // console.log(__dirname)
})


//route for fav page
app.get('/favorite', (req, res) => {
  db.collection('bookrec')
    .find({
      favorite: true
    })
    .toArray((err, result) => {
      result.sort((a, b) => parseFloat(b.upVote) - parseFloat(a.upVote));
      if (err) return console.log(err)
      console.log(result)
      res.render('favorite.ejs', { bookrec: result })
    })
})

app.post('/books', (req, res) => {
  db.collection('bookrec').insertOne({
    title: req.body.title,
    author: req.body.author,
    link: req.body.link,
    rating: 0,
    favorite: false
    //this is what the default value for the rating is. This could have been assigned null/NAN/etc :3
  }, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})



app.put('/rating', (req, res) => {
  db.collection('bookrec')
    .findOneAndUpdate({
      title: req.body.title,
      author: req.body.author
    }, {
      $set: {
        rating: req.body.rating
      }
    }, {
      sort: { _id: -1 },
      upsert: false
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
})



app.delete('/books', (req, res) => {
  db.collection('bookrec')
    .findOneAndDelete({
      title: req.body.title,
      author: req.body.author,
      link: req.body.link
    }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
})
