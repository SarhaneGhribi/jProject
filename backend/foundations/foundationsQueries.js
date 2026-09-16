// shared database connection (configured via environment variables, see backend/.env.example)
const conn = require("../db")
// this function gets all of the foundations from the foundation table in my database (GET)
const getAllFoundations=(callback)=>{
    const sql = "select * from foundations"
     conn.query(sql,(err,results)=>{
        callback(err,results)
     })
    }
// this function gets one of the foundations from the foundations table in my database (GET)
    const getOneFoundation =(name,callback)=>{
        const sql = "select * from foundations where name = ?"
        conn.query(sql,[name],(err,results)=>{
            callback(err,results)
         })
    }
//this function adds one foundation to the foundations table in my database (POST)
    const addOneFoundation=(foundation,callback)=>{
        const sql = `insert into foundations set ?`
        conn.query(sql,foundation,(err,results)=>{
            callback(err,results)})
    }
//this function updates one of the foundations in the foundations table in my database (UPDATE)
    const updateOneFoundation=(updated,name,callback)=>{
        const sql= "update foundations set ? where name = ?"
        conn.query(sql,[updated,name],(err,results)=>{
            callback(err,results)})
    }
// This function deletes one of the foundations in the foundations table in my database (DELETE)
    const deleteOneFoundation=(name,callback)=>{
     const sql="delete from foundations where name = ?"
     conn.query(sql,[name],(err,results)=>{
        callback(err,results)})
    }
    // I exported all of the functions to call them in the foundationsConn.js file
    module.exports={
        getAllFoundations,
        getOneFoundation,
        addOneFoundation,
        updateOneFoundation,
        deleteOneFoundation
    }
