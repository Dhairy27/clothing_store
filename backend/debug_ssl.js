const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongoUrl = process.env.MONGODB_URL;

if (!mongoUrl) {
    console.log('MONGODB_URL missing');
    process.exit(1);
}

async function test(name, opts) {
    const client = new MongoClient(mongoUrl, opts);
    try {
        await client.connect();
        await client.db('admin').command({ ping: 1 });
        console.log(`PASS: ${name}`);
        await client.close();
    } catch (e) {
        console.log(`FAIL: ${name} - ${e.message.split(':')[0]}`);
    }
}

async function run() {
    await test('Default', {});
    await test('TLS_Insecure', { tls: true, tlsAllowInvalidCertificates: true });
    await test('IPv4', { family: 4 });
}

run();
