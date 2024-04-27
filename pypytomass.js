//  Create a vCard for each row of the CSV
//




const fs = require('fs');
const csv = require('csv-parser');
const vCardsJS = require('vcards-js');

function createVCard(contact) {
    const vCard = vCardsJS();

    // Set properties from the CSV fields
    vCard.firstName = contact['Fname'] || '';
    vCard.lastName = contact['Lname'] || '';
    vCard.email = contact['Email'] || '';
    vCard.cellPhone = contact['Phone Number'] || '';
    vCard.organization = contact['Organization'] || '';
    vCard.title = contact['Title'] || '';
    vCard.url = contact['Website'] || '';
    vCard.note = contact['Notes'] || '';

    // Set address information
    vCard.homeAddress.street = contact['Street'] || '';
    vCard.homeAddress.city = contact['City'] || '';
    vCard.homeAddress.region = contact['Region'] || '';
    vCard.homeAddress.postalCode = contact['Postal Code'] || '';
    vCard.homeAddress.country = contact['Country'] || '';

    return vCard;
}

function csvToVCF(csvFilePath, outputDir, baseFileName) {
    fs.mkdirSync(outputDir, { recursive: true }); // Create output directory if it doesn't exist

    let index = 1; // Initialize index counter

    // Read the CSV file
    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
            // Create a vCard for each row of the CSV
            const vCard = createVCard(row);
            const vcfFilePath = `${outputDir}${baseFileName}_${index}.vcf`; // Generate unique file name
            fs.writeFileSync(vcfFilePath, vCard.getFormattedString());
            index++; // Increment index counter
        })
        .on('end', () => {
            console.log('Conversion completed successfully.');
        });
}

// Example usage
const csvFilePath = 'dbo_NVnew_1.csv';
const outputDir = 'output_vcf/';
const baseFileName = 'dbo_NVnew';
csvToVCF(csvFilePath, outputDir, baseFileName);