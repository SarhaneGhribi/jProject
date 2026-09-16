// shared database connection (configured via environment variables, see backend/.env.example)
const conn = require("../db")
// this function gets all of the donerss from the doners table in my database (GET)
const getAlldoners=(callback)=>{
    const sql = "select * from doners"
     conn.query(sql,(err,results)=>{
        callback(err,results)
     })
    }
// this function gets one of the donerss from the donerss table in my database (GET)
    const getOnedoner =(name,callback)=>{
        const sql = "select * from doners where name = ?"
        conn.query(sql,[name],(err,results)=>{
            callback(err,results)
         })
    }
//this function adds one doners to the doners table in my database (POST)
    const addOnedoner=(doners,callback)=>{
        const sql = `insert into doners set ?`
        conn.query(sql,doners,(err,results)=>{
            callback(err,results)})
    }
//this function updates one of the donerss in the doners table in my database (UPDATE)
    const updateOnedoner=(updated,name,callback)=>{
        const sql= "update doners set ? where name = ?"
        conn.query(sql,[updated,name],(err,results)=>{
            callback(err,results)})
    }
// This function deletes one of the donerss in the doners table in my database (DELETE)
    const deleteOnedoner=(name,callback)=>{
     const sql="delete from doners where name = ?"
     conn.query(sql,[name],(err,results)=>{
        callback(err,results)})
    }
    // I exported all of the functions to call them in the donersConn.js file
    module.exports={
        getAlldoners,
        getOnedoner,
        addOnedoner,
        updateOnedoner,
        deleteOnedoner
    }
