const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.listen(process.env.POST || 3000, function (){
    console.log("Server is Running: 3000");
})


app.get("/", function (req, res){
    res.sendFile(__dirname+"/signup.html");
})


app.post("/", function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    console.log(firstName, lastName, email);
    
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    }

const jsonData = JSON.stringify(data);

const url = "https:us9.api.mailchimp.com/3.0/lists/cc86fc34e1"
const options = {
    method:"post",
    auth: "ace:8e0ee814b82032634730fd3f1a08b014-us9"
}


const request = https.request(url, options, function (response){
response.on("data", function (data){
    if (response.statusCode === 200) {
        res.sendFile(__dirname+"/success.html");
    } else {
        res.sendFile(__dirname+"/failure.html");
    }
})
})
request.write(jsonData);
request.end();

})


app.post("/failure", function(req, res){
    res.redirect("/");
})


// API KEY
// 8e0ee814b82032634730fd3f1a08b014-us9


// Audience ID
// cc86fc34e1


// endpoint
// https:usX.api.mailchimp.com/3.0/lists/<audience-key>



