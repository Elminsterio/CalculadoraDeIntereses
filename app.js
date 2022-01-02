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


let fechasIniciales = [];
let fechasFinales = [];
let cantidades = [];
let tipos = [];
let titulos = [];
let expediente = '';
let calculo = 0;

const question = (frase) => {

    return new Promise((resolve) => {

      rl.question(`${frase} `, (resp) => {

        resolve(resp);

    })
  })
}


async function ejecutorPregunta(frase, fraseFail, tipo, variable = '') {

  let response = await question(frase);

  switch(tipo) {

    case 'fecha':

      if(/(?:3[01]|[12][0-9]|0?[1-9])([\/])(0?[1-9]|1[0-2])\1\d{4}$/.test(response)) {

        variable.push(response);
    
       } else {
    
        await ejecutorPregunta(fraseFail, fraseFail, tipo, variable);
    
      }
    
      break;

    case 'cantidadArr':

      response = response.replace(/,/g, '.')

      if(!isNaN(response) && Number(response) > 0) {

        variable.push(response);
    
       } else {
    
        await ejecutorPregunta(fraseFail, fraseFail, tipo, variable);
    
      }
    
      break;

    case 'cantidad':

        if(!isNaN(response) && Number.isInteger(Number(response)) && Number(response) > 0) {
  
          expediente = response;
      
         } else {
      
          await ejecutorPregunta(fraseFail, fraseFail, tipo);
      
        }
      
        break;

    case 'tipoInt':

    if(response == 'legal' || response == 'mora') {

      variable.push(response);
  
     } else {
  
      await ejecutorPregunta(fraseFail, fraseFail, tipo, variable);
  
    }

      break;

    case 'calculo':

      if(response < 14 && response > 0 && Number.isInteger(Number(response))) {

        calculo = response;
    
       } else if (!isNaN(response)) {
    
        await ejecutorPregunta(fraseFail, fraseFail, tipo);
    
      } else {

        await ejecutorPregunta(fraseFail, fraseFail, tipo);

      }
    

    break;

    case 'titulo':

      if(response.length < 21) {

        variable.push(response);
    
       } else {

        await ejecutorPregunta(fraseFail, fraseFail, tipo, variable);

      }
    }
}


async function executionInt() {

  await ejecutorPregunta('Introduce el número del expediente: ', 'El valor introducido no es una cantidad o no es un entero (no introducir símbolos ni puntos): ', 'cantidad');
  await ejecutorPregunta('Introduce la cantidad de cálculos de intereses: ', 'No puede exceder de 13 cálculos o tener letras: ', 'calculo');

  for(let i = 0; i < calculo; i++) {

    console.log(`\n Cálculo nº ${i+1} \n`)

    await ejecutorPregunta('Introduce el tipo de interés aplicable (legal o mora): ', 'El tipo de interés introducido no es ni legal ni mora, reintrodúzcalo: ', 'tipoInt', tipos);
    await ejecutorPregunta('Introduce el título de la tabla: ', 'El título excede de los 20 carácteres, reintrodúzcalo: ', 'titulo', titulos);
    await ejecutorPregunta('Introduce la fecha inicial (dd/mm/aaaa): ', 'Por favor, introduce la fecha en formato dd/mm/aaaa: ', 'fecha', fechasIniciales);
    await ejecutorPregunta('Introduce la fecha final (dd/mm/aaaa): ', 'Por favor, introduce la fecha en formato dd/mm/aaaa: ', 'fecha', fechasFinales);
    await ejecutorPregunta('Introduce la cantidad: ', 'El valor introducido no es una cantidad (no introducir símbolos ni puntos): ' ,'cantidadArr', cantidades);
  
  }
  
  let contenido = HTMLFinalContent(fechasIniciales, fechasFinales, cantidades, tipos, titulos);

  return htmlToDocx(contenido);

}


executionInt()
  .then(async (result) => {

if (!fs.existsSync(path.join(__dirname, `./expedientes`))) {
      
  fs.mkdirSync(path.join(__dirname, `./expedientes`));

}

  if (!fs.existsSync(path.join(__dirname, `./expedientes/${expediente}`))) {
      
    fs.mkdirSync(path.join(__dirname, `./expedientes/${expediente}`));
  
  }
  
  fs.writeFileSync(path.join(__dirname + `/expedientes/${expediente}/${expediente} - ANEXO 1.docx`), result); 

  console.log(`${expediente} - ANEXO 1.docx se ha guardado con éxito`);

  return question('¿Desea que expedir escrito de liquidación de intereses?');

})
  .then((resp) => {

  if(resp == 'si' || resp == 'sí') {

    generarEscrito(fechasIniciales, fechasFinales, cantidades, tipos, titulos, expediente);

    console.log('El escrito de liquidación de intereses se ha guardado con éxito');

    rl.close();
  }
  
  rl.close();

  })
  .catch(err => {
    console.log('No se ha podido realizar el cálculo, inténtelo de nuevo');
    console.log('-------------------------------------------------------\n');
    console.log(err);
    rl.close();
  });



