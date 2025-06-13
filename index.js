const express = require("express")
const connectDb = require("./src/config/db")
const path = require('path');
var cors = require('cors');
const dotenv = require('dotenv');
const routes = require("./src/routes")
const router = express.Router();
const app = express()

   
dotenv.config();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'https://task-forge-front-end.vercel.app/', // or your frontend domain
    credentials: true // if you're sending cookies or authorization headers
}));
app.use('/', routes);

(async ()=> {
    await connectDb();
})();
(() => {
    app.listen(process.env.port || 5000);
})();

router.get('/', function (req, res) {
    res.send("Welcome");
});