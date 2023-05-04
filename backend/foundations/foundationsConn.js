const {
    getAllFoundations,
    getOneFoundation,
    addOneFoundation,
    updateOneFoundation,
    deleteOneFoundation
}=require("./foundationsQueries")
module.exports={
    //this function gets all of data of the foundations table and then passes a callback as an argument in the getAllFoundations function
    getAll:(req,res)=>{
        const cb=(err,succ)=>{
            if(err)res.status(500).send(err);
            else res.json(succ)
        }
    getAllFoundations(cb)
},
    //this function gets one foundation from the foundations table and then passes a callback and name as arguments in the getOneFoundation function
    getOne:(req,res)=>{
        const name=req.params.name
        const cb=(err,suc)=>{
            if(err)res.status(500).send(err);
            else res.json(suc)
        }
        getOneFoundation(name,cb)
    },
//this function gets the body from the post request and then passes a callback and the post body as arguments in the addOneFoundation function
    addOne:(req,res)=>{
        const body= req.body
        console.log(body)
        const cb=(err,suc)=>{
            if(err)res.status(500).send(err);
            else res.json(suc)
        }
        addOneFoundation(body,cb)
    },
//this function gets the body and the targeted foundation name from the patch request and then passes them and a callback as arguments in the updateOneFoundation function
    updateOne:(req,res)=>{
        const body= req.body
        const name=req.params.name
        console.log(body,name)
        const cb=(err,suc)=>{
            if(err)res.status(500).send(err);
            else res.json(suc)
        }
        updateOneFoundation(body,name,cb)
    },
//this function gets the targeted foundation name from the delete request and then passes it and a callback as arguments in the deletOneFoundation function
    deleteOne:(req,res)=>{
        const name=req.params.name
        const cb=(err,suc)=>{
            if(err)res.status(500).send(err);
            else res.json(suc)
        }
        deleteOneFoundation(name,cb)
    }
}