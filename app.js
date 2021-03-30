const express=require("express");
const app=express();

app.set('view engine','ejs');
var items=[];

app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/",function(req,res){
    let dat=new Date();
    let options={
        weekday:"long",
        day:"numeric",
        month:"long"
    }
    let day=dat.toLocaleDateString("en-US",options);
    res.render("list.ejs",{currentDay:day,tasks:items});
})

app.post("/",function(req,res){
    items.push(req.body.task);
    res.redirect("/");
})
























app.listen(3000,function(){
    console.log("Listening on 3000");
})