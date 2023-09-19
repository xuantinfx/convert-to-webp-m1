const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const CWEBP_PATH = `${__dirname}/cwebpm1`;

async function convertToWebp(file, filePath, outputFilePath) {
    return new Promise((resolve, reject) => {
        exec(`${CWEBP_PATH} ${filePath} -o ${outputFilePath}`, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            console.log(`Converted ${file} to WebP format`);
            // Remove original image file
            fs.unlinkSync(filePath);
            console.log(`Removed ${file}`);
            resolve();
        });
    });
}

// Define a function to recursively loop through all files and subfolders in a folder
async function processFolder(folderPath) {
    console.log('Processing', folderPath);
    // Read the contents of the folder
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            // Recursively process subfolders
            processFolder(filePath);
        } else if (path.extname(file).toLowerCase() === '.jpg' || path.extname(file).toLowerCase() === '.jpeg' || path.extname(file).toLowerCase() === '.png') {
            // Convert image files to WebP format
            const outputFilePath = path.join(folderPath, path.parse(file).name + '.webp');
            await convertToWebp(file, filePath, outputFilePath);
        }
    }
}

// Call the processFolder function to start processing the folder
console.log(__dirname)
processFolder(__dirname + '/folder-will-convert-to-webp');
// processFolder('/Users/mac/Documents/Kitemetric/fantasy-world/asset-dev/fantasy-world-public-asset-dev/assets/slime/thumbnail');