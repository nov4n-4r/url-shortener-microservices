require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser")
const shorturlModel = require("./model/shorturl")
const Model = new shorturlModel()
const app = express();


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.route("/api/shorturl")
  .post((req, res) => {
    if (!req.body.url) res.redirect(`shorturl`)
    const pattern = /^http(s)?:\/\/(.)+$/gi
    const match = pattern.test(req.body.url)
    if (match) {
      const result = Model.insertUrl(req.body.url)
//       console.log(result)
      return res.json({
        original_url: result.url,
        short_url: result.id
      })
    } else {
      res.json({
        error: "invalid url"
      })
    }
  })

app.route("/api/shorturl/:id")
  .get((req, res) => {
//     console.log(req.params)
    const result = Model.getUrlById(parseInt(req.params.id))
    res.redirect(result.url)
  })

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
