// const express = require("express")
// const connectDb = require("./src/config/db")
// const path = require('path');
// var cors = require('cors');
// const dotenv = require('dotenv');
// const routes = require("./src/routes")
// const router = express.Router();
// const app = express()

   
// dotenv.config();
// app.use(cors())
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors({
//     origin: 'https://task-forge-front-end.vercel.app/', // or your frontend domain
//     credentials: true // if you're sending cookies or authorization headers
// }));
// app.use('/', routes);

// (async ()=> {
//     await connectDb();
// })();
// (() => {
//     app.listen(process.env.port || 5000);
// })();

// router.get('/', function (req, res) {
//     res.send("Welcome");
// });



const express = require("express");
const connectDb = require("./src/config/db");
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require("./src/routes");

dotenv.config();

const app = express();

// Allow CORS
app.use(cors({
    origin: 'https://task-forge-front-end.onrender.com/', // replace with your frontend origin
    credentials: true
}));
console.log('wow')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default welcome route
app.get('/', (req, res) => {
    res.send("Welcome");
});

// App routes
app.use('/', routes);

// Connect to DB and start server
(async () => {
    await connectDb();
    app.listen(process.env.port || 5000, () => {
        console.log(`Server running on port ${process.env.port || 5000}`);
    });
})();
