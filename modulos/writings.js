const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

const fs = require('fs');
const path = require('path');

// The error object contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
function replaceErrors(key, value) {
    if (value instanceof Error) {
        return Object.getOwnPropertyNames(value).reduce(function(error, key2) {
            error[key2] = value[key];
            return error;
        }, {});
    }
    return value;
}


function errorHandler(error) {

    console.log(JSON.stringify({error: error}, replaceErrors));

    if (error.properties && error.properties.errors instanceof Array) {
        const errorMessages = error.properties.errors.map(function (error2) {
            return error2.properties.explanation;
        }).join("\n");
        console.log('errorMessages', errorMessages);
    }
    throw error;
}

function spawnFile(calculations) {
    // Load the docx file as binary content
    let content = fs
        .readFileSync(path.join(__dirname, '../assets/Intereses.docx'), 'binary');

    let zip = new PizZip(content);
    let doc;
    try {
        doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
    } catch(error) {
        // Catch compilation errors (errors caused by the compilation of the template: misplaced tags)
        errorHandler(error);
    }

    // Preestablece las variables

    const date = new Date();
    const fileNumber = calculations.get('fileNumber');
    const { totalAmount, totalInterests } = calculations.get('finalCalculations');

    // set the templateVariables

    doc.setData({

        fileNumber,
        totalAmount,
        totalInterests: totalInterests.toFixed(2),
        todayDate: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`

    });

    try {
        // render the document 
        doc.render();
    }
    catch (error) {
        // Catch rendering errors 
        errorHandler(error);
    }

    let buf = doc.getZip()
                .generate({type: 'nodebuffer'});

    // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
    fs.writeFileSync(path.join(process.cwd() + `/expedientes/${fileNumber}`, `${fileNumber} - LIQUIDACIÓN DE INTERESES.docx`), buf);
}

module.exports = spawnFile;