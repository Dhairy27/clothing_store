const fs = require('fs');
const path = require('path');

function verify() {
    console.log("Starting static verification...");

    // 1. Check Backend Dependencies
    const packageJson = fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8');
    if (packageJson.includes('"multer"')) {
        console.log("✅ package.json contains multer");
    } else {
        console.error("❌ package.json MISSING multer");
    }

    // 2. Check Server Config
    const serverJs = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');
    if (serverJs.includes('multer') && serverJs.includes('upload.array')) {
        console.log("✅ server.js configured with multer");
    } else {
        console.error("❌ server.js MISSING multer config");
    }

    // 3. Check Admin HTML
    const adminHtml = fs.readFileSync(path.join(__dirname, '../frontend/admin.html'), 'utf8');
    if (adminHtml.includes('type="file"') && adminHtml.includes('multiple') && adminHtml.includes('FormData')) {
        console.log("✅ admin.html has file input and FormData logic");
    } else {
        console.error("❌ admin.html MISSING updates");
    }

    // 4. Check Product Info HTML
    const productInfo = fs.readFileSync(path.join(__dirname, '../frontend/product-info.html'), 'utf8');
    if (productInfo.includes('product-gallery') && productInfo.includes('product.images')) {
        console.log("✅ product-info.html has gallery logic");
    } else {
        console.error("❌ product-info.html MISSING gallery logic");
    }
}

verify();
