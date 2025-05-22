const express = require("express")
const connectDb = require("./src/config/db")
const path = require('path');
const router = express.Router();
const app = express()
const dotenv = require('dotenv');   
dotenv.config();



router.get('/', function (req, res) {
    res.send("Welcome");
});

app.use('/', router);

(() => {
    app.listen(process.env.port || 3000);
})();

connectDb()