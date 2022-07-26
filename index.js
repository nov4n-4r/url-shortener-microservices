require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser")
const shorturlModel = require("./model/shorturl")

const app = express();


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.route(`shorturl`)
    .get((req, res) => {
        res.render("shorturl")
    })
    
app.route("/api/shorturl")
    .post((req, res) => {
        if(!req.body.url) res.redirect(`shorturl`)
        const pattern = /^http(s)?:\/\/(www)\.(\w)+\.(.)+$/gi
        const match = pattern.test(req.body.url)
        if(match){
            const Model = new shorturlModel()
            Model.insertUrl(req.body.url, (data) => 
                res.json({
                    original_url : data.url,
                    shorturl : data.id
                })
            )
        }else{
            res.json({
                error : "invalid url"
            })
        }
    })

app.route(`/api/shorturl/:id`)
    .get((req, res) => {
        const Model = new shorturlModel()
        Model.getUrl( {id : parseInt(req.params.id)})
            .then(data => data[0])
            .then(data => res.redirect(data.url))
            .catch(err => res.json({error : "Shorturl not found"}))
    })

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
