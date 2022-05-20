const express = require('express')
const app = express()
const port = 3000
const token = '8112557887258041'

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

const quickAuth = (req, res, next) => {
  if (req.query.authToken !== token) {
    res.send('Wrong Token')
  }

  next()
}

app.use(quickAuth)

app.get('/pools/:poolId', (req, res) => {
  if(req.params.poolId){
    console.log('INCLUDE ID IN QUERY')
  }

  res.send('RETURN QUERY')
})

app.post('/pools', (req, res) => {  
  res.send('CREATE EMPTY NEW POOL, RETURN ALL POOLS')
})

app.patch('/pool/:poolId', (req, res) => {
  if(!req.params.poolId) return res.send("PoolId is required")

  res.send('UPDATE POOL NFTS AND RETURN NEW')
})

app.delete('/pool/:poolId', (req, res) => {
  if(!req.params.poolId) return res.send("PoolId is required")

  res.send('DELETE POOL')
})