const dayjs = require('dayjs');
const isBetween = require('dayjs/plugin/isBetween')
const isLeapYear = require('dayjs/plugin/isLeapYear');

dayjs.extend(isLeapYear);
dayjs.extend(isBetween);

let interestsCalculation = ({initialDate, endDate, amount, typeInterestsRate, customInterestsRate}) => {
    switch(typeInterestsRate) {

        case 'legal':
        return legalInterestsCalculation(initialDate, endDate, amount);

        case 'mora':
        return legalInterestsCalculation(initialDate, endDate, amount, 2);

        case 'personalizado':
        return customInterestsCalculator(initialDate, endDate, amount, customInterestsRate);
    } 
};

const legalInterestsCalculation = (initialDate, endDate, amount, diferential = 0) => {

    const INTERESTS_RATE_PER_DATE = require('../assets/interests.json');

    const initialDateParsed = completeDateParserToDayJS(initialDate);
    const endDateParsed = completeDateParserToDayJS(endDate);
    
    let totalInterests = 0;
    const calculations = [];

    INTERESTS_RATE_PER_DATE.forEach(period => {
        const periodDateParsed = dayjs(period.startInterestsDate);
        const finalPeriodDateParsed = dayjs(period.endInterestsDate);

        const itsBetween = periodDateParsed.isBetween(initialDateParsed, endDateParsed) || 
                           finalPeriodDateParsed.isBetween(initialDateParsed, endDateParsed);
        if(!itsBetween) return;

        const itsInitial = initialDateParsed.isBetween(periodDateParsed, finalPeriodDateParsed);
        const itsLast = endDateParsed.isBetween(periodDateParsed, finalPeriodDateParsed);

        let daysOnPeriod;
        if(itsInitial && itsLast) daysOnPeriod = endDateParsed.diff(initialDateParsed, 'days');
        else if(itsInitial) daysOnPeriod = finalPeriodDateParsed.diff(initialDateParsed, 'days');
        else if(itsLast) daysOnPeriod = endDateParsed.diff(periodDateParsed, 'days');
        else daysOnPeriod = finalPeriodDateParsed.diff(periodDateParsed, 'days');
        daysOnPeriod++;

        const totalDaysActualYear = periodDateParsed.isLeapYear() ? 366 : 365;
        const ratePerDay = ((period.annualInterestRate + diferential) / 100) / totalDaysActualYear;
        const interestsCycle = (amount * ratePerDay * daysOnPeriod);
        totalInterests += interestsCycle;

        calculations.push({actualYearInterests: interestsCycle, 
                           daysPerInterestsCycle: daysOnPeriod, 
                           amount, 
                           annualInterestRate: period.annualInterestRate, 
                           startDatePeriod: itsInitial ? initialDateParsed.format('DD/MM/YYYY') : periodDateParsed.format('DD/MM/YYYY'), 
                           endDatePeriod: itsLast ? endDateParsed.format('DD/MM/YYYY') : finalPeriodDateParsed.format('DD/MM/YYYY') 
        });
    })

    calculations.push({ totalInterests })
    return calculations;
}

const customInterestsCalculator = (initialDate, endDate, amount, rate) => {

    const initialDateParsed = completeDateParserToDayJS(initialDate);
    const endDateParsed = completeDateParserToDayJS(endDate);
    
    let totalInterests = 0;
    const calculations = [];

    const yearsToCalculate = endDateParsed.year() - initialDateParsed.year();

    for(let i = 0; yearsToCalculate >= i; i++) {

        const periodDateParsed = dayjs((initialDateParsed.year() + i) + '');
        const finalPeriodDateParsed = periodDateParsed.add(1, 'year').subtract(1, 'days');

        const itsInitial = initialDateParsed.isBetween(periodDateParsed, finalPeriodDateParsed);
        const itsLast = endDateParsed.isBetween(periodDateParsed, finalPeriodDateParsed);

        let daysOnPeriod;
        if(itsInitial && itsLast) daysOnPeriod = endDateParsed.diff(initialDateParsed, 'days');
        else if(itsInitial) daysOnPeriod = finalPeriodDateParsed.diff(initialDateParsed, 'days');
        else if(itsLast) daysOnPeriod = endDateParsed.diff(periodDateParsed, 'days'); 
        else daysOnPeriod = finalPeriodDateParsed.diff(periodDateParsed, 'days');
        daysOnPeriod++;

        const totalDaysActualYear = periodDateParsed.isLeapYear() ? 366 : 365;
        const ratePerDay = (rate / 100) / totalDaysActualYear;
        const interestsCycle = amount * (ratePerDay * daysOnPeriod);
        totalInterests += interestsCycle;

        calculations.push({actualYearInterests: interestsCycle, 
            daysPerInterestsCycle: daysOnPeriod, 
            amount, 
            annualInterestRate: rate, 
            startDatePeriod: itsInitial ? initialDateParsed.format('DD/MM/YYYY') : periodDateParsed.format('DD/MM/YYYY'), 
            endDatePeriod: itsLast ? endDateParsed.format('DD/MM/YYYY') : finalPeriodDateParsed.format('DD/MM/YYYY') 
        });
    }
    calculations.push({ totalInterests })
    return calculations;
}

function completeDateParserToDayJS(date) {

    const [ day, month, year ] = date.split('/');

    return dayjs(`${month} ${day} ${year}`)

}

module.exports = interestsCalculation;