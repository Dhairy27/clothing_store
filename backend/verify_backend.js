const http = require('http');

function makeRequest(method, path, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(JSON.parse(body));
                    } else {
                        resolve({ error: true, status: res.statusCode, body: body });
                    }
                } catch (e) {
                    resolve({ error: true, status: res.statusCode, body: body, parseError: e });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function verify() {
    try {
        console.log('1. Fetching products...');
        const products = await makeRequest('GET', '/api/products');

        if (products.error) {
            console.error('Failed to fetch products:', products);
            return;
        }

        if (!Array.isArray(products) || products.length === 0) {
            console.log('No products found to test.');
            return;
        }

        const product = products[0];
        const productId = product._id || product.id;
        console.log(`2. Testing with product: ${product.name} (ID: ${productId})`);

        // Toggle to false
        console.log('3. Setting inCollection to false...');
        const updateDataFalse = {
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
            sizes: product.sizes,
            inCollection: false
        };

        const updateResFalse = await makeRequest('PUT', `/api/admin/products/${productId}`, updateDataFalse);

        if (updateResFalse.error) {
            console.log('Update to false failed:', updateResFalse);
            return;
        }
        console.log('Update to false successful!');

        // Verify persistence
        const updatedProductFalse = await ((await makeRequest('GET', `/api/products`)).find(p => (p._id || p.id) === productId));
        if (updatedProductFalse && updatedProductFalse.inCollection === false) {
            console.log('SUCCESS: inCollection=false persisted.');
        } else {
            console.log('FAILURE: inCollection=false NOT persisted.', updatedProductFalse);
        }

        // Toggle back to true
        console.log('4. Setting inCollection back to true...');
        const updateDataTrue = {
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
            sizes: product.sizes,
            inCollection: true
        };

        const updateResTrue = await makeRequest('PUT', `/api/admin/products/${productId}`, updateDataTrue);
        if (!updateResTrue.error) {
            console.log('Update to true successful!');
            const updatedProductTrue = await ((await makeRequest('GET', `/api/products`)).find(p => (p._id || p.id) === productId));
            if (updatedProductTrue && (updatedProductTrue.inCollection === true || updatedProductTrue.inCollection === undefined)) {
                console.log('SUCCESS: inCollection=true persisted.');
            } else {
                console.log('FAILURE: inCollection=true NOT persisted.', updatedProductTrue);
            }
        }

    } catch (err) {
        console.error('Verification error:', err);
    }
}

verify();
