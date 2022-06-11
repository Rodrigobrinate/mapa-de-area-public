const express = require('express')
const app = express()
const port = 3000
const router = require('./routes')
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})