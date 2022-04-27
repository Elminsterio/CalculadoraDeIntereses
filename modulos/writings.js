const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

const fs = require('fs');
const path = require('path');
const interestsCalculation = require('./legalInterestsCalculator.js');

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

function calculoTotalExpediente(calculations) {

    let cantTotal = 0;
    let intTotal = 0;

    for(let calculation of calculations) {

        let resultsInterests = interestsCalculation(calculation[1].initialDate, calculation[1].endDate, calculation[1].amount, calculation[1].typeInterestsRate, calculation[1].title);

        if(tipoIntArr[i] !== 'mora' || tipoIntArr.length === 1) cantTotal += resultsInterests[resultsInterests.length - 1][0];
        intTotal += resultsInterests[resultsInterests.length - 1][1];

    }

    return [cantTotal.toFixed(2), intTotal.toFixed(2)];

}

function generarEscrito(calculations) {
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

    let fecha = new Date();
    let arrCantyIntTot = calculoTotalExpediente(calculations);

    // set the templateVariables

    doc.setData({

        expediente,
        cantidad: arrCantyIntTot[0],
        cantidadInt: arrCantyIntTot[1],
        fechaHoy: `${fecha.getDate()}/${fecha.getMonth()}/${fecha.getFullYear()}`

    });

    try {
        // render the document 
        doc.render()
    }
    catch (error) {
        // Catch rendering errors 
        errorHandler(error);
    }

    let buf = doc.getZip()
                .generate({type: 'nodebuffer'});

    // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
    fs.writeFileSync(path.join(process.cwd() + `/expedientes/${expediente}`, `${expediente} - LIQUIDACIÓN DE INTERESES.docx`), buf);
}

module.exports = generarEscrito;