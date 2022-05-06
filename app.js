const htmlToDocx = require('html-to-docx');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

const HTMLFinalContent = require('./modules/patternInterestsDocument.js');
const spawnFile = require('./modules/writings.js');
const interestsCalculation = require('./modules/legalInterestsCalculator');
const calculationObjectPrompts = require('./utils/prompts');


async function executionInt() {
  
  // Acumular las respuestas
  
  let calculations = new Map();
  let totalAmount = 0;
  let totalInterests = 0;
  let totalInterestsWithAmount = 0;

  const { fileNumber, numberOfCalculations } = await inquirer.prompt([calculationObjectPrompts.fileNumber, calculationObjectPrompts.numberOfCalculations]);

  for(let i = 1; i <= numberOfCalculations; i++) {
    
    const { typeInterestsRate, title, initialDate, endDate, amount, isCorrect, elementsToCorrect } = calculationObjectPrompts;

    typeInterestsRate.prefix = `(Cálculo nº ${i})`;
    title.prefix = `(Cálculo nº ${i})`;
    initialDate.prefix = `(Cálculo nº ${i})`;
    endDate.prefix = `(Cálculo nº ${i})`;
    amount.prefix = `(Cálculo nº ${i})`;
    console.log(`\n► Preguntas Cálculo nº ${i}:\n`);
    
    let responsesCalculation = await inquirer.prompt([typeInterestsRate, title, initialDate, endDate, amount]);
    
    let answeredCorrections;
    let isCorrectNow = await inquirer.prompt([isCorrect]);
    while(!isCorrectNow.isCorrect) {

        const elementsToCorrectNow = await inquirer.prompt([elementsToCorrect]);
        const arrayWithElementsToCorrect = elementsToCorrectNow.elementToCorrect.map(value => calculationObjectPrompts[value]);
        answeredCorrections = await inquirer.prompt(arrayWithElementsToCorrect);
        isCorrectNow = await inquirer.prompt([isCorrect]);
    }

    responsesCalculation = {...responsesCalculation, ...answeredCorrections};
    let calculation = interestsCalculation(responsesCalculation);
    calculations.set(i, {...responsesCalculation, calculation});
    
    totalAmount += responsesCalculation.amount;
    totalInterests += calculation[calculation.length - 1].totalInterests;

  }

  totalInterestsWithAmount = totalInterests + totalAmount;

  calculations.set('finalCalculations', {totalInterests, totalInterestsWithAmount, totalAmount});
  calculations.set('fileNumber', fileNumber);
  
  return calculations;
}


// Crear función asíncrona para generar el archivo y los archivos correspondientes.
async function main() {

  try {

    let calculationsObject = await executionInt();

    let content = HTMLFinalContent(calculationsObject);
    let docCalculations = await htmlToDocx(content);

    let fileNumber = calculationsObject.get('fileNumber');
  
    if (!fs.existsSync(path.join(__dirname, `./expedientes`))) {
      fs.mkdirSync(path.join(__dirname, `./expedientes`));
    }
    
      if (!fs.existsSync(path.join(__dirname, `./expedientes/${fileNumber}`))) { 
        fs.mkdirSync(path.join(__dirname, `./expedientes/${fileNumber}`));
      }
      
      fs.writeFileSync(path.join(__dirname + `/expedientes/${fileNumber}/${fileNumber} - ANEXO 1.docx`), docCalculations); 
      console.log(`${fileNumber} - ANEXO 1.docx se ha guardado con éxito`);

      const { writingToCourt } = await inquirer.prompt([calculationObjectPrompts.writingToCourt]);
      if(writingToCourt) {
        spawnFile(calculationsObject);
        console.log('El escrito de liquidación de intereses se ha guardado con éxito');
      }
  } catch(e) {
    console.error('No se ha podido realizar el cálculo, inténtelo de nuevo');
    console.error('-------------------------------------------------------\n');
    console.error(e.message);
  }
}

main();
