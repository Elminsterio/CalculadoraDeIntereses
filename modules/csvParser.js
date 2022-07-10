const getInterestsCSV = require('./csvDownloader');
const dayjs = require('dayjs');
const fs = require('fs');
const rl = require('readline');
const fsPromises = require("fs/promises");

class BasicCSVParser {
  reader;
  #fileInput;
  rateInterests = [];
  #periodInterests = {};
  monthsOnString = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  monthsRegex = new RegExp(`(${this.monthsOnString.join('|')} \\d{4})`, 'gi');

  constructor(fileInputName) {
    this.#fileInput = fileInputName;
    this.reader = rl.createInterface({ 
      input: fs.createReadStream(this.#fileInput)
               .setEncoding('latin1')
    });
  }

  static checkInterestsCSVFile(fileOutputName) {
    
  }

  start(rateName) {
    let pastYear;
    let pastMonth;
    let pastRate;
    let rateTargetIndex;

    this.reader.on("line", (row) => { 
      const rowCleaned = row.replace(/"*/gi, '');
      const columns = rowCleaned.split(",");
    
      if(columns[0] === 'DESCRIPCIï¿½N DE LA SERIE') rateTargetIndex = columns.findIndex(col => col.toLocaleLowerCase()
                                                                                                   .includes(rateName));
    
      const isValidPeriod = this.monthsRegex.test(columns[0]);
      if(!isValidPeriod) return;
    
      const date = columns[0].replace(this.monthsRegex, '$1').split(' ');
      const year = Number(date[1]);
      const month = this.monthsOnString.indexOf(date[0]) + 1;
      const rateLegalInterests = parseFloat(columns[rateTargetIndex]);
    
      const isFirstPeriod = !pastRate && !pastMonth && !pastYear;
      if(isFirstPeriod) {
        pastRate = rateLegalInterests;
        pastMonth = month;
        pastYear = year;
      }
    
      const isPresentPeriod = year === dayjs().year() && month === dayjs().month();
      const isPeriodChanged = pastRate !== rateLegalInterests || pastYear !== year || isPresentPeriod;
      if(!isPeriodChanged) return;
    
      let endDateParsed;
      if(isPresentPeriod) endDateParsed = dayjs([year + 1, 1]).subtract(1, 'day').format();
      else endDateParsed = dayjs([year, month]).subtract(1, 'day').format();
    
      this.#periodInterests['annualInterestRate'] = pastRate;
      this.#periodInterests['startInterestsDate'] = dayjs([pastYear, pastMonth]).format();
      this.#periodInterests['endInterestsDate'] = endDateParsed;
      this.rateInterests.push({...this.#periodInterests});
    
      pastYear = year;
      pastMonth = month;
      pastRate = rateLegalInterests;
    })
    return this;
  }

  save(fileOutputName = '') {
    return new Promise((resolve, reject) => {
      this.reader.on('close', async () => {
        const data = JSON.stringify(this.rateInterests);
        try {
          await fsPromises.writeFile(fileOutputName, data);
          resolve();
        } catch(error) {
          console.log('%c No se puede actualizar la base de datos de índices. Se utilizarán los datos almacenados.', 'color: red');
        }
      })
    })
  }
}

module.exports = async function downloadAndSaveInterests() {
  try {
    const fileName = await getInterestsCSV();
    console.log('%cDescargada base de datos actualizada con éxito...', 'font-weight: bold;')
    const legal = new BasicCSVParser(fileName);
    await legal.start('legal').save('./assets/interests.json');
    console.log('%cActualizada la base de datos con éxito...', 'font-weight: bold;')
  } catch(error) {
    return error
  }
}
