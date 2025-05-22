const mongoose = require('mongoose');

async function connectDb() {
    console.log("Connecting to MongoDB with Mongoose...", process.env.MONGO_URL);
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000, // Optional: connection timeout
        });
        console.log("✅ Mongoose connected to MongoDB");
    } catch (error) {
        console.error(' Mongoose connection error:', error);
        process.exit(1); // Optional: exit if DB connection fails
    }
}

module.exports = connectDb;