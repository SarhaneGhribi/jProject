// I imported mysql2 to create a connection with my database
const sql = require("mysql2")
// I created a connection with my databse using my configurations
const conn= sql.createConnection({
    host: "localhost",
    user: "root",
    password: "Sarhane1991.",
    database: "myfoundation",
  }
)  
// I connected with my database
conn.connect((err)=>{
    if(err)console.log("database not connected")
    else console.log("database connected")
})
// this function gets all of the donerss from the doners table in my database (GET)
const getAlldoners=(callback)=>{
    const sql = "select * from doners"
     conn.query(sql,(suc,err,f)=>{
        callback(suc,err)
     })
    }
// this function gets one of the donerss from the donerss table in my database (GET)   
    const getOnedoner =(name,callback)=>{
        const sql = `select * from doners where name="${name}"`
        conn.query(sql,(suc,err,f)=>{
            callback(suc,err)
         })
    }
//this function adds one doners to the doners table in my database (POST)
    const addOnedoner=(doners,callback)=>{
        const sql = `insert into doners set ?`
        conn.query(sql,doners,(suc,err,f)=>{
            callback(suc,err)})
    }
//this function updates one of the donerss in the doners table in my database (UPDATE)   
    const updateOnedoner=(updated,name,callback)=>{
        const sql= `update doners set ? where name="${name}"`
        conn.query(sql,updated,(suc,err,f)=>{
            callback(suc,err)}) 
    }
// This function deletes one of the donerss in the doners table in my database (DELETE)
    const deleteOnedoner=(name,callback)=>{
     const sql=`delete from doners where name="${name}"`
     conn.query(sql,(suc,err,f)=>{
        callback(suc,err)})
    }
    // I exported all of the functions to call them in the donersConn.js file
    module.exports={
        getAlldoners,
        getOnedoner,
        addOnedoner,
        updateOnedoner,
        deleteOnedoner
    }