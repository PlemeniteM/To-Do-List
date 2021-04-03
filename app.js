const express=require("express");
const mongoose=require("mongoose");
const app=express();

app.set('view engine','ejs');

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todoListDB",{useNewUrlParser:true,useUnifiedTopology:true});

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
         res.render("list.ejs",{currentDay:"Today",taks:results});
    });
   

    
})

app.post("/",function(req,res){
    const ina=req.body.task;
    const nt=new Task({
        task:ina
    })
    nt.save();
    
    //items.push(req.body.task);
    res.redirect("/");
})
























app.listen(3000,function(){
    console.log("Listening on 3000");
})