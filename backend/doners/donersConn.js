const {
    getAlldoners,
    getOnedoner,
    addOnedoner,
    updateOnedoner,
    deleteOnedoner
}=require("./donersQeuries")
module.exports={
    //this function gets all of data of the doners table and then passes a callback as an argument in the getAlldoners function
    getAll:(req,res)=>{
        const cb=(err,succ)=>{
            if(err)res.status(500).send(err);
            else res.json(succ)
        }
    getAlldoners(cb)
},
    //this function gets one doner from the doners table and then passes a callback and name as arguments in the getOnedoner function
    getOne:(req,res)=>{
        const name=req.params.name
        const cb=(err,suc)=>{
            if(err)res.status(500).send(err);
            else res.json(suc)
        }
        getOnedoner(name,cb)
    },
//this function gets the body from the post request and then passes a callback and the post body as arguments in the addOnedoner function
    addOne:(req,res)=>{
        const body= req.body
        console.log(body)
        const cb=(err,suc)=>{
            if(err)res.status(500).send(err);
            else res.json(suc)
        }
        addOnedoner(body,cb)
    },
//this function gets the body and the targeted doner name from the patch request and then passes them and a callback as arguments in the updateOnedoner function
    updateOne:(req,res)=>{
        const body= req.body
        const name=req.params.name
        console.log(body,name)
        const cb=(err,suc)=>{
            if(err)res.status(500).send(err);
            else res.json(suc)
        }
        updateOnedoner(body,name,cb)
    },
//this function gets the targeted doner name from the delete request and then passes it and a callback as arguments in the deletOnedoner function
    deleteOne:(req,res)=>{
        const name=req.params.name
        const cb=(err,suc)=>{
            if(err)res.status(500).send(err);
            else res.json(suc)
        }
        deleteOnedoner(name,cb)
    }
}