const mongoose = require("mongoose")

mongoose.connect(process.env.DB_URL, {
    useCreateIndex:true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false
}).then(()=>{
    console.log("DB Successfully connnected");
}).catch(err=>{
    console.log(err);
})