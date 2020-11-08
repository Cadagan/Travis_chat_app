require('dotenv').config();

const { Client } = require('pg');
console.log("Initializing database...");
client = new Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DBNAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
});


exports.connect = async function(){
    console.log(`Connecting to database at: ${client.host}-${client.port}:${client.database}-${client.user}`);
    return client.connect();
};

exports.client = client;
