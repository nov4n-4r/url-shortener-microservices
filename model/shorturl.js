const mongodb = require("mongodb")
class urlShortenerMicroserviesModel{
    constructor(url = "mongodb+srv://novan:12345@cluster0.vrmp5.mongodb.net/?retryWrites=true&w=majority"){
        this.client = new mongodb.MongoClient(url)
        this.db = this.client.db("fcc-challenge")
        this.insertUrl = this.insertUrl.bind(this)
        this.collection = this.db.collection("url-shortener-microservices")
    }

    connect(){
        this.client.connect()
            .then( () => console.log("Connection created") )
            .catch( err => console.log(err) )  
    }

    insertUrl(url, callback = res => {console.log(res);}){
        this.getUrl({url : url})
            // Checking is the url registered or not
            .then(data => typeof(data[0]) != "undefined")
            .then(registered => {
                // if not registered then register it
                if(!registered){
                    this.getLatestID()
                        // Add 1 for id (auto increment) 
                        .then(id => id+1 )
                        // Inserting data
                        .then(id => 
                            this.collection.insertOne({id : id, url : url})
                        )
                        .then(inserted => inserted.insertedId.toString())
                        .then(insertedID => 
                            this.getUrl( {_id : mongodb.ObjectId(insertedID)}, data => {
                                data = data[0]
                                callback(data)
                            } )
                        )
                // if its registered
                }else{ 
                    this.getUrl( {url : url}, data => {
                        data = data[0]
                        callback(data);
                    } )
                }
            })
        
    }
    
    async getLatestID(){
        return await this.collection.find().sort({id : -1}).limit(1).toArray()
            .then(res => res[0])
            .then(res => res.id)
            .catch(id => 0)
    }

    async getUrl(query={}, callback){
        if(!callback){
            return await this.collection.find(query).toArray()
        }else{
            await this.collection.find(query).toArray()
                .then(data => callback(data))
        }
    }

}

module.exports = urlShortenerMicroserviesModel