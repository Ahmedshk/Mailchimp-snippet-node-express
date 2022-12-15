const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const client = require("mailchimp-marketing");

const app = express();


app.use(bodyParser.urlencoded({extended: true}));
//this is use to include the external css files or assets to the node project
app.use(express.static("public"));


//index page route set
app.get("/", function(req,res){
 res.sendFile(__dirname + "/signup.html")
});

//posting the reques to mailchimp server to add to subscribed list
app.post("/", function(req,res){
 const firthName = req.body.fName;
 const lastName = req.body.lName;
 const email = req.body.userEmail;


//data set which is going to be posted
const data = {
  members: [
    {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firthName,
        LNAME: lastName
      }
    }
  ]
}
//Sending data to mailchimp after converting to json format
const jsonData = JSON.stringify(data);

//List id after /lists/
const url = "https://us21.api.mailchimp.com/3.0/lists/bc9b7adb18";
const options = {
  method: "POST",
  //Api key
  auth: "ahmed:f68eabd417e8ffe8d856471975c871f2-us21"
  }
const request = https.request(url, options, function(response){

if (response.statusCode === 200){

  res.sendFile(__dirname + "/success.html")
}
else {
  res.sendFile(__dirname + "/failure.html")
}

  response.on("data", function(data){
    console.log(JSON.parse(data));
  })
})
request.write(jsonData);
request.end();
});
//process.env.PORT make the port dynamic which allows the server to use any post which ever is on their local server
// || 3000 add this and defining the port we can use the app localy as well
app.listen(process.env.PORT || 3000);
