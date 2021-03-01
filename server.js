const express = require("express")
const fs = require("fs")
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000
const dbList = './db/db.json'

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/notes', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/notes.html'))
})

app.get('/api/notes', function(req, res) {
  let tableList = fs.existsSync(dbList) ? JSON.parse( fs.readFileSync(dbList) ) : []
  res.send(tableList)
})

app.post('/api/notes', function(req, res) {
  const data = req.body
  let dataList = fs.existsSync(dbList) ? JSON.parse( fs.readFileSync(dbList) ) : []
  // assign an id to the data
  const givenId = (dt) => {
    const len = dataList.length
    let id = 0
    for (var dt of dataList) {id = (dt.id > id) ? dt.id : id}
    id++
    data['id'] = id
  }
  givenId(data)
  dataList.push(data)

  fs.writeFileSync(dbList, JSON.stringify(dataList))
  res.send(dataList)
})

app.delete('/api/notes/:id', function(req, res) {
  const id = req.params.id
  let dataList = fs.existsSync(dbList) ? JSON.parse( fs.readFileSync(dbList) ) : []
  for (var data of dataList) {
    if(data.id == id) {
      let index = dataList.indexOf(data)
      dataList.splice(index, 1)
    }
  }

  fs.writeFileSync(dbList, JSON.stringify(dataList))
  res.send(dataList)
})

app.listen(PORT, function() {
  console.log(`Listening on port: ${PORT}`)
})