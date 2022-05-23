const express = require('express')
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb')
const app = express()
const port = process.env.PORT || 3000
const token = '8112557887258041'
const uri = "mongodb+srv://boblp:328bu5ad@cluster0.lz6dt.mongodb.net/?retryWrites=true&w=majority"
let db

app.use(cors());

app.all('*', function(req, res, next) {
  var origin = req.get('origin'); 
  res.header('Access-Control-Allow-Origin', origin);
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

MongoClient.connect(uri, function(err, database) {
  if(err) return console.error(err)
  db = database.db('nfts')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

const quickAuth = (req, res, next) => {
  if (req.query.authToken !== token) return res.status(401).send('Wrong Token')

  next()
}

app.use(quickAuth)

app.get('/pools/', (req, res) => {
  db.collection('pools').find().toArray((err, docs) => {
    if (err) return res.status(500).send(err)

    return res.status(200).send(docs)
  })
})

app.get('/pools/:poolId', (req, res) => {
  if (!req.params.poolId) res.send('INCLUDE ID IN QUERY')
  const _id = new ObjectId(req.params.poolId)

  db.collection('pools').find({ _id }).toArray((err, docs) => {
    if (err) return res.status(500).send(err)

    return res.status(200).send(docs[0])
  })
})

app.post('/pools', (req, res) => {
  if (!req.query.name) res.send('DATA MISSING')

  const obj = {
    name: req.query.name,
    nfts: []
  }

  db.collection('pools').insertOne(obj, (err, docs) => {
    if (err) return res.status(500).send(err)

    return res.status(200).send(docs)
  })
})

app.patch('/pools/:poolId', (req, res) => {
  const { poolId } = req.params
  const nfts = JSON.parse(req.query.nfts)

  if(!poolId || !nfts) return res.send("PoolId is required")

  const _id = new ObjectId(poolId)
  const update = { $set: nfts }

  db.collection('pools').updateOne({ _id }, update, (err, docs) => {
    if (err) return res.status(500).send(err)
    
    return res.status(200).send(docs)
  })
})

app.delete('/pools/:poolId', (req, res) => {
  if (!req.params.poolId) res.send('DATA MISSING')
  const _id = new ObjectId(req.params.poolId)

  db.collection('pools').deleteOne({ _id }, (err, docs) => {
    if (err) return res.status(500).send(err)
    
    return res.status(200).send(docs)
  })
})
