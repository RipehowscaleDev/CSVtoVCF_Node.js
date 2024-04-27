// SPLIT THE SIZE OF A CSV FILE to approximately 2000 rows
// it is not recommended to go highter than 3500 r0ws because of tiers contacts limitations
// Excepted for special needs


const fs = require('fs');
const readline = require('readline');

function splitCsv(inputFile, outputPrefix, chunkSize) {
    let lineNumber = 0;
    let fileNumber = 1;
    let outputStream = fs.createWriteStream(`${outputPrefix}_${fileNumber}.csv`);

    const rl = readline.createInterface({
        input: fs.createReadStream(inputFile),
        crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        lineNumber++;
        outputStream.write(line + '\n');

        if (lineNumber % chunkSize === 0) {
            outputStream.end();
            fileNumber++;
            outputStream = fs.createWriteStream(`${outputPrefix}_${fileNumber}.csv`);
        }
    });

    rl.on('close', () => {
        outputStream.end();
        console.log('Split complete.');
    });
}

// Example usage
const inputFile = 'dbo_NVnew.csv';
const outputPrefix = 'dbo_NVnew';
const chunkSize = 2000; // Adjust this value as needed

splitCsv(inputFile, outputPrefix, chunkSize);