import express from 'express';
import path from 'path'; // Import the path module
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
const port = 3000;

const uri = "mongodb+srv://expertprog111:pasichnyk19721965@wisefoppasichnyk.fteaihd.mongodb.net/?retryWrites=true&w=majority&appName=wisefopPasichnyk";
const client = new MongoClient(uri);

app.use(cors());

async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const database = client.db("wisefop"); // replace with your actual database name
       

        //Dictionaries
        const usersCollection = database.collection("users");
        app.get('/api/users', async (req, res) => {
            const users = await usersCollection.find({}).toArray();
            res.json(users);
        });

        const listStoragesCollection = database.collection("listStorages");
        app.get('/api/listStorages', async (req, res) => {
            const listStorages = await listStoragesCollection.find({}).toArray();
            res.json(listStorages);
        });

        const listOperationsCollection =database.collection('listOperations');
        app.get('/api/listOperations', async (req, res) => {
            const listOperations = await listOperationsCollection.find({}).toArray();
            res.json(listOperations);
        });


        // DATA tables
        const productsCollection =database.collection('products');

        app.get('/api/products', async (req, res) => {
            try {
                const products = await productsCollection
                .find() //
                .toArray();

                res.json(products);
            } catch (error) {
                console.error("Error fetching products:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });


        // ... Add more API endpoints as needed ...

    
        // Serve index.html when the root path '/' is requested
        app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html')); 
        });

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
