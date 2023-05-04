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
// this function gets all of the foundations from the foundation table in my database (GET)
const getAllFoundations=(callback)=>{
    const sql = "select * from foundations"
     conn.query(sql,(suc,err,f)=>{
        callback(suc,err)
     })
    }
// this function gets one of the foundations from the foundations table in my database (GET)   
    const getOneFoundation =(name,callback)=>{
        const sql = `select * from foundations where name="${name}"`
        conn.query(sql,(suc,err,f)=>{
            callback(suc,err)
         })
    }
//this function adds one foundation to the foundations table in my database (POST)
    const addOneFoundation=(foundation,callback)=>{
        const sql = `insert into foundations set ?`
        conn.query(sql,foundation,(suc,err,f)=>{
            callback(suc,err)})
    }
//this function updates one of the foundations in the foundations table in my database (UPDATE)   
    const updateOneFoundation=(updated,name,callback)=>{
        const sql= `update foundations set ? where name="${name}"`
        conn.query(sql,updated,(suc,err,f)=>{
            callback(suc,err)}) 
    }
// This function deletes one of the foundations in the foundations table in my database (DELETE)
    const deleteOneFoundation=(name,callback)=>{
     const sql=`delete from foundations where name="${name}"`
     conn.query(sql,(suc,err,f)=>{
        callback(suc,err)})
    }
    // I exported all of the functions to call them in the foundationsConn.js file
    module.exports={
        getAllFoundations,
        getOneFoundation,
        addOneFoundation,
        updateOneFoundation,
        deleteOneFoundation
    }