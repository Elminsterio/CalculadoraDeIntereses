const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

const fs = require('fs');
const path = require('path');
const calcularInteresA = require('./calculadoraLegal.js');

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
        // errorMessages is a humanly readable message looking like this:
        // 'The tag beginning with "foobar" is unopened'
    }
    throw error;
}

function calculoTotalExpediente(fechaIniArr, FechaFinArr, cantidadArr, tipoIntArr, tituloArr) {

    let cantTotal = 0;
    let intTotal = 0;

    for(let i = 0; i < fechaIniArr.length; i++) {

        let calculos = calcularInteresA(fechaIniArr[i], FechaFinArr[i], cantidadArr[i], tipoIntArr[i], tituloArr[i]);

        cantTotal += calculos[calculos.length - 1][0];
        intTotal += Number(calculos[calculos.length - 1][1]);

    }

    return [cantTotal.toFixed(2), intTotal.toFixed(2)];

};

function generarEscrito(fechaIniArr, FechaFinArr, cantidadArr, tipoIntArr, tituloArr, expediente) {
    // Load the docx file as binary content
    let content = fs
        .readFileSync(path.resolve(__dirname, '../assets/Intereses.docx'), 'binary');

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
    let arrCantyIntTot = calculoTotalExpediente(fechaIniArr, FechaFinArr, cantidadArr, tipoIntArr, tituloArr);

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
};

module.exports = generarEscrito;