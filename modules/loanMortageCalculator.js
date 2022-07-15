const dayjs = require('dayjs');
const isBetween = require('dayjs/plugin/isBetween')
const isLeapYear = require('dayjs/plugin/isLeapYear');

dayjs.extend(isLeapYear);
dayjs.extend(isBetween);

function mortageLoan(quantity, initialDate, totalNumMonths, freezeMonthsPeriod = 0, diferential = 0, floor = 0) {

  const initialDateParsed = completeDateParserToDayJS(initialDate);
  const initialMonth = initialDateParsed.get('month');
  const totalRatesFilteredOnlyOnRevision = getRevisionInterests(initialDateParsed, totalNumMonths, require('../assets/euribor.json'))

  let remainQuantity = quantity;
  let revisionIndexPeriod = 0;
  let actualRate = totalRatesFilteredOnlyOnRevision[revisionIndexPeriod].annualInterestRate;

  const calculations = [];

  for(let i = 0; i < totalNumMonths; i++) {

      const isRevisionPeriod = i % 12;
      const isNextRatePublished = totalRatesFilteredOnlyOnRevision[revisionIndexPeriod + 1];
      if(!isRevisionPeriod && isNextRatePublished) revisionIndexPeriod++;

      actualRate = totalRatesFilteredOnlyOnRevision[revisionIndexPeriod].annualInterestRate + diferential < floor && floor ? 
                   floor : 
                   totalRatesFilteredOnlyOnRevision[revisionIndexPeriod].annualInterestRate + diferential;

      const actualMonthlyRate = (actualRate / 100) / 12;
      const monthTotal = quantity * ((1 + actualMonthlyRate) ** totalNumMonths * actualMonthlyRate) / 
                                    ((1 + actualMonthlyRate) ** totalNumMonths - 1);
      const monthInterests = actualMonthlyRate * remainQuantity;
      const monthPrincipal = monthTotal - monthInterests;
      // TODO: en freeze period avoid interests 
      if(freezeMonthsPeriod <= i) remainQuantity = remainQuantity - monthPrincipal;

      calculations.push({
          actualRate,
          monthTotal,
          monthPrincipal,
          monthInterests,
          remainQuantity,
          initialDate: initialDateParsed.set('month', initialMonth + i + 1).format('DD/MM/YYYY')
      })
  }

  return calculations;
}

function loanWithoutFloor(quantity, initialDate, finalDate, totalNumMonths, floor, freezeMonthsPeriod = 0, diferential = 0) {
  // TODO: Set next month not
  const amortizationWithoutFloor = mortageLoan(quantity, initialDate, totalNumMonths, freezeMonthsPeriod, diferential, 0)
      .filter(({initialDate}) => completeDateParserToDayJS(initialDate) < completeDateParserToDayJS(finalDate));
  const amortizationWithFloor = mortageLoan(quantity, initialDate, totalNumMonths, freezeMonthsPeriod, diferential, floor)
      .filter(({initialDate}) => completeDateParserToDayJS(initialDate) < completeDateParserToDayJS(finalDate));

  const diferences = amortizationWithoutFloor.reduce((acc, currentPeriod, index) => {
      const { monthInterests, monthPrincipal } = currentPeriod;
      const monthInterestsWithFloor = amortizationWithFloor[index].monthInterests;
      const monthPrincipalsWithFloor = amortizationWithFloor[index].monthPrincipal;

      amortizationWithFloor[index]['monthDiferenceInterests'] = monthInterestsWithFloor - monthInterests;
      amortizationWithFloor[index]['monthDiferencePrincipal'] = monthPrincipalsWithFloor - monthPrincipal;

      acc.diferenceInterests += monthInterestsWithFloor - monthInterests;
      acc.diferencePrincipal += monthPrincipalsWithFloor - monthPrincipal;
      return acc;
  }, {diferenceInterests: 0, diferencePrincipal: 0});

  return {amortizationWithoutFloor, amortizationWithFloor, diferences};
}


function getRevisionInterests(initialDate, totalNumPeriods, indexPeriods) {
  const [ initialYear, initialMonth ] = [ initialDate.year(), initialDate.month() ];

  return indexPeriods.filter(({ startInterestsDate, endInterestsDate }) => {
      const initialRateDate = dayjs(startInterestsDate);
      const endRateDate = dayjs(endInterestsDate);
      return initialRateDate.month() <= initialMonth && initialMonth <= endRateDate.month() && initialRateDate.year() >= initialYear
  })
}

function completeDateParserToDayJS(date) {

  const [ day, month, year ] = date.split('/');

  return dayjs(`${month} ${day} ${year}`)
}


module.exports = loanWithoutFloor;