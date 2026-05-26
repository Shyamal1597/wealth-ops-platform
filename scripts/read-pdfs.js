const fs = require('fs');
const pdf = require('pdf-parse');

async function extractText(filePath) {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        console.log(`\n\n--- EXTRACTED: ${filePath} ---\n\n`);
        console.log(data.text);
    } catch (e) {
        console.error(`Error reading ${filePath}:`, e);
    }
}

async function main() {
    await extractText('C:\\Users\\SSFL-RETAIL-017\\Downloads\\enable - SEBIDeck_pvt circulation Dec 2025.pdf');
    await extractText('C:\\Users\\SSFL-RETAIL-017\\Downloads\\sebi circular dated -8th dec 2025.pdf');
}

main();
