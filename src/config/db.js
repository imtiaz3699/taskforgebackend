const { MongoClient } = require('mongodb');
async function listDatabases(client) {
    try {
        databasesList = await client.db().admin().listDatabases();

        console.log("Databases:");
        databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    } catch (error) {
        console.error('Error listing databases:', error);
    }
};
async function connectDb() {
    console.log("Connecting to MongoDB...",process.env.MONGO_URL);
    try {
        const client = new MongoClient(process.env.MONGO_URL);
        await client.connect();
        await listDatabases(client);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = connectDb;