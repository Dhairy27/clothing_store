const { MongoClient } = require('mongodb');
const http = require('http');

async function run() {
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('clothing_store');

        // Get 2 valid products
        const products = await db.collection('products').find().limit(2).toArray();

        if (products.length < 2) {
            console.log('Not enough products to test grouping.');
            return;
        }

        const ids = products.map(p => p._id.toString());
        console.log('Attempting to group IDs:', ids);

        const postData = JSON.stringify({
            productIds: ids
        });

        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/admin/products/group',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');

            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                console.log(`BODY: ${body}`);
                client.close();
            });
        });

        req.on('error', (e) => {
            console.error(`Request error: ${e.message}`);
            client.close();
        });

        req.write(postData);
        req.end();

    } catch (e) {
        console.error('Script error:', e);
        if (client) client.close();
    }
}

run();
