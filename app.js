const htmlToDocx = require('html-to-docx');

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const HTMLFinalContent = require('./patternLiquidacion.js');
const generarEscrito = require('./modulos/escritos.js');

const rl = readline.createInterface(
  process.stdin,
  process.stdout
);

const question = (str) => new Promise(resolve => rl.question(str, resolve));

async function ejecutorPregunta(tipo, frase, fraseFail='') {

  let response = await question(frase);
  let condition;
  // La función ha de retornar los valores una vez tratados por el filtro.
  // ejecutar la pregunta de fallo en cada iteración en la que no se cumpla
  // la condición.

  // Evitar recursividad.

  switch(tipo) {

    case 'fecha':
    // crear una variable que almacene la condición y tras el switch, hacer un if con la condicion.
      condition = /(?:3[01]|[12][0-9]|0?[1-9])([\/])(0?[1-9]|1[0-2])\1\d{4}$/.test(response);
      break;
    case 'cantidadArr':
      response = response.replace(/,/g, '.');
      condition = !isNaN(response) && Number(response) > 0;
      break;
    case 'cantidad':
      condition = !isNaN(response) && 
                  Number.isInteger(Number(response)) && 
                  Number(response) > 0;
      break;
    case 'tipoInt':
      condition = response == 'legal' || response == 'mora';
      break;
    case 'calculo':
      condition = response < 14 && 
                  response > 0 && 
                  Number.isInteger(Number(response));
    break;
    case 'titulo':
      condition = response.length < 21;
    break;
    case 'isCorrect':
      condition = response === 'si' || 
                  response === 'sí' ||
                  response === 'Sí' ||
                  response === 'Si' ||
                  response === '' ||
                  response === 'no' ||
                  response === 'No'
    break;
    case 'correction':
      condition = 1 <= response <= 4 && 
                  !isNaN(response) &&
                  Number.isInteger(Number(response));
    break;
    }
  
  if(condition) return response;
  else ejecutorPregunta(tipo, fraseFail);
  
}

let calculations = new Map();
async function executionInt() {
  
  // Acumular las respuestas
  
  let fileNumber = await ejecutorPregunta('cantidad', 'Introduce el número del expediente: ', 'El valor introducido no es una cantidad o no es un entero (no introducir símbolos ni puntos): ');
  let numberCalculations = await ejecutorPregunta('calculo', 'Introduce la cantidad de cálculos de intereses: ', 'No puede exceder de 13 cálculos o tener letras: ');

  for(let i = 1; i <= numberCalculations; i++) {

    // Acumular en variables
    console.log(`\n Cálculo nº ${i} \n`)

    let typeInterestsRate = await ejecutorPregunta('tipoInt', 'Introduce el tipo de interés aplicable (legal o mora): ', 'El tipo de interés introducido no es ni legal ni mora, reintrodúzcalo: ');
    let title = await ejecutorPregunta('titulo', 'Introduce el título de la tabla: ', 'El título excede de los 20 carácteres, reintrodúzcalo: ');
    let initialDate = await ejecutorPregunta('fecha', 'Introduce la fecha inicial (dd/mm/aaaa): ', 'Por favor, introduce la fecha en formato dd/mm/aaaa: ');
    let endDate = await ejecutorPregunta('fecha', 'Introduce la fecha final (dd/mm/aaaa): ', 'Por favor, introduce la fecha en formato dd/mm/aaaa: ');
    let amount = await ejecutorPregunta('cantidadArr', 'Introduce la cantidad: ', 'El valor introducido no es una cantidad (no introducir símbolos ni puntos): ');
    
    let isCorrect = await ejecutorPregunta('isCorrect', '¿Son correctos los datos introducidos? (si/no)', 'Por favor, introduzca si o no.');
    let isCorrectNow = false;
    if(isCorrect === 'si' || isCorrect === '' || isCorrect === 'Sí') isCorrectNow = true;

    while(!isCorrectNow) {
        console.log(`
        1. Tipo de tipo de interes.
        2. Título de la tabla.
        3. Fecha inicial de calculo.
        4. Fecha final de calculo.
        5. Cantidad. 
        `);
        let elementToCorrect = await ejecutorPregunta('correction', 'Introduce el número del elemento a modificar: ', 'El elemento seleccionado no es correcto');
        
        switch(Number(elementToCorrect)) {
          case 1:
            typeInterestsRate = await ejecutorPregunta('tipoInt', 'Introduce el tipo de interés aplicable (legal o mora): ', 'El tipo de interés introducido no es ni legal ni mora, reintrodúzcalo: ');
            break;
          case 2:
            title = await ejecutorPregunta('titulo', 'Introduce el título de la tabla: ', 'El título excede de los 20 carácteres, reintrodúzcalo: ');
            break;
          case 3:
            initialDate = await ejecutorPregunta('fecha', 'Introduce la fecha inicial (dd/mm/aaaa): ', 'Por favor, introduce la fecha en formato dd/mm/aaaa: ');
            break;
          case 4:
            endDate = await ejecutorPregunta('fecha', 'Introduce la fecha final (dd/mm/aaaa): ', 'Por favor, introduce la fecha en formato dd/mm/aaaa: ');
            break;
          case 5:
            amount = await ejecutorPregunta('cantidadArr', 'Introduce la cantidad: ', 'El valor introducido no es una cantidad (no introducir símbolos ni puntos): ');
            break;
        }
        isCorrect = await ejecutorPregunta('isCorrect', '¿Son correctos los datos introducidos? (si/no) ', 'Por favor, introduzca si o no.');
        if(isCorrect === 'si' || isCorrect === '' || isCorrect === 'Sí') isCorrectNow = true;
    }

    calculations.set(i, {typeInterestsRate, title, initialDate, endDate, amount});
  }
  
  let content = HTMLFinalContent(calculations);

  calculations.set('fileNumber', fileNumber);
  
  return content;

}

// Crear función asíncrona para generar el archivo y los archivos correspondientes.
async function processContent() {

  try {

    let content = await executionInt();
    let result = await htmlToDocx(content);
    let fileNumber = calculations.get('fileNumber')
  
    if (!fs.existsSync(path.join(__dirname, `./expedientes`))) {
      fs.mkdirSync(path.join(__dirname, `./expedientes`));
    }
    
      if (!fs.existsSync(path.join(__dirname, `./expedientes/${fileNumber}`))) { 
        fs.mkdirSync(path.join(__dirname, `./expedientes/${fileNumber}`));
      }
      
      await fs.writeFile(path.join(__dirname + `/expedientes/${fileNumber}/${fileNumber} - ANEXO 1.docx`), result); 
      console.log(`${fileNumber} - ANEXO 1.docx se ha guardado con éxito`);

      let writingToCourt = await question('¿Desea que expedir escrito de liquidación de intereses?');
      if(writingToCourt == 'si' || writingToCourt == 'sí') {
        generarEscrito(calculations);
        console.log('El escrito de liquidación de intereses se ha guardado con éxito');
      }
      rl.close();
  
  } catch(e) {
    console.log('No se ha podido realizar el cálculo, inténtelo de nuevo');
    console.log('-------------------------------------------------------\n');
    console.log(e);
    rl.close();
  }
}

processContent()
