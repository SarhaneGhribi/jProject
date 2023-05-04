const express = require("express");
const path = require('path');
const app = express();
const cors =require ('cors');
app.use(cors());
app.use(express.json())
const db= require("./foundations/foundationsConn.js")
const dbDoners=require("./doners/donersConn.js")

const port = 5000;
app.use(express.static(path.join(__dirname, '..', 'public')));
// paths for foundations
app.get("/foundations",db.getAll)
app.get("/foundations/:name",db.getOne)
app.post("/foundations",db.addOne)
app.patch("/foundations/:name",db.updateOne)
app.delete("/foundations/:name",db.deleteOne)
// paths for doners
app.get("/doners",dbDoners.getAll)
app.get("/doners/:name",dbDoners.getOne)
app.post("/doners",dbDoners.addOne)
app.patch("/doners/:name",dbDoners.updateOne)
app.delete("/doners/:name",dbDoners.deleteOne)
app.listen(port,(err)=>{
    if(err) console.log(`server off ligne`)
    else console.log(`Server on ligne on port:${port}`)
    })