const mongoose=require('mongoose')
// Force Node.js to use public DNS servers for its queries
const dns = require('node:dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);
exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>console.log("DB connected successfully"))
    .catch((error)=>{
       console.log("DB connection failed");
       console.error(error);
       process.exit(1);
    })
}