const express=require("express");
const mongoose=require("mongoose");
const app=express();

app.set('view engine','ejs');

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todoListDB",{useFindAndModify:false,useNewUrlParser:true,useUnifiedTopology:true});

const itemSchema=new mongoose.Schema({
    task:String
});

const Task=mongoose.model("Task",itemSchema);

const task1=new Task({
    task:"Buy food"
})
const task2=new Task({
    task:"Eat food"
})
const task3=new Task({
    task:"Store food"
})

const defaultItems=[task1,task2,task3];

const lSchema=new mongoose.Schema({
    name:String,
    items:[itemSchema]
});

const List=mongoose.model("List",lSchema);




app.get("/",function(req,res){
    Task.find({},function(err,results){
        if(results.length===0){
            Task.insertMany(defaultItems,function(err){
                if(err)console.log(err);
                else {
                    console.log("Success");}
            });
            res.redirect("/");
        }
        else
         res.render("list.ejs",{listName:"Today",taks:results});
    });
})

app.get("/:type",function(req,res){
    //res.render("list.ejs",{currentDay:req.params.type});
    List.findOne({name:req.params.type},function(err,results){
        if(!results){
            const list=new List({
                name:req.params.type,
                items:defaultItems
            });
        
            list.save(function(err){
                if(err)console.log(err);
                else res.redirect("/"+req.params.type);
            });
            
        }
        else{
            res.render("list.ejs",{listName:req.params.type,taks:results.items});
        }
    })
    
})

app.post("/",function(req,res){
    const ina=req.body.task;
    const lName=req.body.button;
    const nt=new Task({
        task:ina
    })
    if(lName==="Today"){
        nt.save();
        res.redirect("/");
    }
    else{
        List.findOne({name:lName},function(err,result){
            
                result.items.push(nt);
                result.save();
                res.redirect("/"+lName);
            
        })
    }
    
})

app.post("/delete",function(req,res){
    const cId=req.body.check;
    const lna=req.body.li;
    if(lna==="Today"){
        Task.findByIdAndRemove(cId,function(err){
            if(err)console.log(err);
            else{
                console.log("Success");
                res.redirect("/");
            }
        })
    }
    else{
        List.findOneAndUpdate({name:lna},{$pull:{items:{_id:cId}}},function(err,result){
            
            //result.items.push(nt);
            //result.save();
            res.redirect("/"+lna);
        
    })
    }
    
    
})
























app.listen(3000,function(){
    console.log("Listening on 3000");
})