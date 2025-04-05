import mongoose from 'mongoose';

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI!);
        // TypeScript can’t guarantee that the environment variable exists.
        // By appending ! (i.e., process.env.MONGO_URI!), you're asserting 
        // to TypeScript that you are sure this value is not undefined, so 
        // it can safely be treated as a string. This avoids the Ts error
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongodB connected successfully');
        })

        connection.on('error', (err) => {
            console.log('MongoDB connection error, pls make sure mongoDB is running. ' + err);
            process.exit();
        })

    } catch (error) {
        console.log("Something went wrong");
        console.log(error)
    }
}

// code doesn’t use await because it’s set up to handle the connection 
// status asynchronously through event listeners rather than 
// synchronously awaiting the connection promise.