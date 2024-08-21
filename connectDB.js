import { MongoClient } from 'mongodb';
let database =null;
const uri = "mongodb+srv://expertprog111:pasichnyk19721965@wisefoppasichnyk.fteaihd.mongodb.net/?retryWrites=true&w=majority&appName=wisefopPasichnyk";

async function connectMongo() {
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Specify the database and collection you want to work with
        database = client.db("wisefop"); // replace with your actual database name
        //const users = database.collection("users"); // replace with your actual collection name

        // Example: Find one document in the collection
        //const fop = await users.findOne({});
        //console.log("Found document:", document);
        //console.log(fop.name)

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    } finally {
        // Close the connection
        await client.close();
    }
}
export{connectMongo,database};
//connectMongo().catch(console.dir);

