const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(3000, function () {
    console.log("Server Running:3000");
})

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/failure", function (req, res) {
    res.redirect("/");
})

app.post("/", function (req, res) {

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

    const apiKey = process.env.apiKey;
    const audienceId = process.env.audienceId;
    const url = `https://us9.api.mailchimp.com/3.0/lists/${audienceId}`
    const options = {
        method: "post",
        auth: `ace:${apiKey}`
    }

    const request = https.request(url, options, function (response) {
        response.on("data", function (data) {
            if (response.statusCode === 200) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
        })
    })

    request.write(jsonData);
    request.end();

})


// endpoint
// https:usX.api.mailchimp.com/3.0/lists/<audience-key>



