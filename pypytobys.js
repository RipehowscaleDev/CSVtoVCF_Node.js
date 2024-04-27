
//pypyto.js  create a vcf file out of a csv file 
// you can load the file at line 53 for the csv
// it create the vcf file  at line 54 based from the csv

const fs = require('fs');
const csv = require('csv-parser');
const vCardsJS = require('vcards-js');

function createVCard(contact) {
    const vCard = vCardsJS();

    // Set properties from the CSV fields
    vCard.email = contact['Email'] || '';
    vCard.firstName = contact['Fname'] || '';
    vCard.lastName = contact['Lname'] || '';
    vCard.homeAddress.street = contact['Street'] || '';
    vCard.homeAddress.city = contact['City'] || '';
    vCard.homeAddress.region = contact['State'] || '';
    vCard.homeAddress.postalCode = contact['Zip'] || '';

    vCard.cellPhone = contact['Phone Number'] || '';
    
    return vCard;
}

function csvToVCF(csvFilePath, vcfFilePath) {
    const vCards = [];

    // Read the CSV file
    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
            // Create a vCard for each row of the CSV
            const vCard = createVCard(row);
            vCards.push(vCard);
        })
        .on('end', () => {
            // Write vCards to a VCF file
            const vcfContent = vCards.map(vCard => vCard.getFormattedString()).join('\n\n');
            fs.writeFileSync(vcfFilePath, vcfContent);
            console.log('Conversion completed successfully.');
        });
}

// Example usage
const csvFilePath = 'dbo_NVnew_10.csv';
const vcfFilePath = 'dbo_NVnew_A.vcf';
csvToVCF(csvFilePath, vcfFilePath);
