//Just to serve the static build output

const express=require("express");
const app=express();
const fs=require("fs")
app.use(express.static("./dist"));
app.use(function(req,res) {
  try {
    fs.lstatSync("./dist/index.html");
    fs.createReadStream("./dist/index.html").pipe(res);
  } catch(e) {
    res.status(404).send("404 - Not Found");
  }
});
app.listen(5890);
console.log("Up & Running on 0.0.0.0:5890")
