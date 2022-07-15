const toHTML = require('./modules/patternLoanMortage');
const loanWithoutFloor = require('./modules/loanMortageCalculator');

const htmlToDocx = require('html-to-docx');
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    console.time('ex')
    let calculationsObject = loanWithoutFloor(180000, '02/01/1999', '15/02/2020', 180, 4, 0, 1.5);
    console.timeEnd('ex')

    let content = toHTML(calculationsObject);
    let docCalculations = await htmlToDocx(content, '<p></p>', {orientation: 'landscape'});
    if (!fs.existsSync(path.join(__dirname, `./expedientes`))) {
      fs.mkdirSync(path.join(__dirname, `./expedientes`));
    }
    
      if (!fs.existsSync(path.join(__dirname, `./expedientes/example`))) { 
        fs.mkdirSync(path.join(__dirname, `./expedientes/example`));
      }
      
      fs.writeFileSync(path.join(__dirname + `/expedientes/example/example - ANEXO 1.docx`), docCalculations); 
      console.log(`example - ANEXO 1.docx se ha guardado con éxito`);

  } catch(e) {
    console.error('No se ha podido realizar el cálculo, inténtelo de nuevo');
    console.error('-------------------------------------------------------\n');
    console.error(e);
  }
}


main()
