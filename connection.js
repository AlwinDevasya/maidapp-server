const mongoose = require('mongoose')

connectionString = process.env.DATABASE 

mongoose.connect(connectionString).then(()=>{
    console.log(`MongoDb connected successfully`);
}).catch((err)=>{
    console.log(`MongoDb connection failed due to ${err}`);    
})