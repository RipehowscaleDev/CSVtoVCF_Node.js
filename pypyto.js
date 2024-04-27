const fs = require('fs');
const csv = require('csv-parser');
const vCardsJS = require('vcards-js');

function createVCard(contact) {
    const vCard = vCardsJS();

    // Set properties from the CSV fields
    vCard.firstName = contact['Fname'] || '';
    vCard.lastName = contact['Lname'] || '';
    vCard.email = contact['Email'] || '';

    // Add +1 prefix to phone number
    vCard.cellPhone = "+1" + (contact['Phone Number'] || '');
    
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
const csvFilePath = 'dbo_NVnew_1.csv';
const vcfFilePath = 'dbo_NVnew.vcf';
csvToVCF(csvFilePath, vcfFilePath);