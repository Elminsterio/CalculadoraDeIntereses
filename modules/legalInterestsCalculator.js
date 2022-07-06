const dayjs = require('dayjs');
const isBetween = require('dayjs/plugin/isBetween')
const isLeapYear = require('dayjs/plugin/isLeapYear');
const arraySupport = require("dayjs/plugin/arraySupport");

dayjs.extend(isLeapYear);
dayjs.extend(isBetween);
dayjs.extend(arraySupport);

const INTERESTS_RATE_PER_DATE = [
    {startInterestsDate: '1993', endInterestsDate: ['1993', '11', '31'],  annualInterestRate: 10.0},
    {startInterestsDate: '1994', endInterestsDate: ['1994', '11', '31'],  annualInterestRate: 9.00},
    {startInterestsDate: '1995', endInterestsDate: ['1995', '11', '31'],  annualInterestRate: 9.00},
    {startInterestsDate: '1996', endInterestsDate: ['1996', '11', '31'],  annualInterestRate: 9.00},
    {startInterestsDate: '1997', endInterestsDate: ['1997', '11', '31'],  annualInterestRate: 7.50},
    {startInterestsDate: '1998', endInterestsDate: ['1998', '11', '31'],  annualInterestRate: 5.50},
    {startInterestsDate: '1999', endInterestsDate: ['1999', '11', '31'],  annualInterestRate: 4.25},
    {startInterestsDate: '2000', endInterestsDate: ['2000', '11', '31'],  annualInterestRate: 4.25},
    {startInterestsDate: '2001', endInterestsDate: ['2001', '11', '31'],  annualInterestRate: 5.50},
    {startInterestsDate: '2002', endInterestsDate: ['2002', '11', '31'],  annualInterestRate: 4.25},
    {startInterestsDate: '2003', endInterestsDate: ['2003', '11', '31'],  annualInterestRate: 4.25},
    {startInterestsDate: '2004', endInterestsDate: ['2004', '11', '31'],  annualInterestRate: 3.75},
    {startInterestsDate: '2005', endInterestsDate: ['2005', '11', '31'],  annualInterestRate: 4.00},
    {startInterestsDate: '2006', endInterestsDate: ['2006', '11', '31'],  annualInterestRate: 4.00},
    {startInterestsDate: '2007', endInterestsDate: ['2007', '11', '31'],  annualInterestRate: 5.00},
    {startInterestsDate: '2008', endInterestsDate: ['2008', '11', '31'],  annualInterestRate: 5.50},
    {startInterestsDate: '2009', endInterestsDate: ['2009', '2', '31'],  annualInterestRate: 5.50},
    {startInterestsDate: ['2009', '3'], endInterestsDate: ['2009', '11', '31'], annualInterestRate: 4.00},
    {startInterestsDate: '2010', endInterestsDate: ['2010', '11', '31'],  annualInterestRate: 4.00},
    {startInterestsDate: '2011', endInterestsDate: ['2011', '11', '31'],  annualInterestRate: 4.00},
    {startInterestsDate: '2012', endInterestsDate: ['2012', '11', '31'],  annualInterestRate: 4.00},
    {startInterestsDate: '2013', endInterestsDate: ['2013', '11', '31'],  annualInterestRate: 4.00},
    {startInterestsDate: '2014', endInterestsDate: ['2014', '11', '31'],  annualInterestRate: 4.00},
    {startInterestsDate: '2015', endInterestsDate: ['2015', '11', '31'],  annualInterestRate: 3.50},
    {startInterestsDate: '2016', endInterestsDate: ['2016', '11', '31'],  annualInterestRate: 3.00},
    {startInterestsDate: '2017', endInterestsDate: ['2017', '11', '31'],  annualInterestRate: 3.00},
    {startInterestsDate: '2018', endInterestsDate: ['2018', '11', '31'],  annualInterestRate: 3.00},
    {startInterestsDate: '2019', endInterestsDate: ['2019', '11', '31'],  annualInterestRate: 3.00},
    {startInterestsDate: '2020', endInterestsDate: ['2020', '11', '31'],  annualInterestRate: 3.00},
    {startInterestsDate: '2021', endInterestsDate: ['2021', '11', '31'],  annualInterestRate: 3.00},
    {startInterestsDate: '2022', endInterestsDate: ['2022', '11', '31'],  annualInterestRate: 3.00}
];

let interestsCalculation = ({initialDate, endDate, amount, typeInterestsRate}) => {

    switch(typeInterestsRate) {

        case 'legal':
        return legalInterestsCalculation(initialDate, endDate, amount);

        case 'mora':
        return legalInterestsCalculation(initialDate, endDate, amount, 2);

        case 'personalizado':
        return 
    }

       
};

let legalInterestsCalculation = (initialDate, endDate, amount, differential = 0) => {

    let initialDateParsed = completeDateParserToDayJS(initialDate);
    let endDateParsed = completeDateParserToDayJS(endDate);
    
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
        const ratePerDay = ((period.annualInterestRate + differential) / 100) / totalDaysActualYear;
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

let completeDateParserToDayJS = function(date) {

    const [ day, month, year ] = date.split('/');

    return dayjs(`${month} ${day} ${year}`)

}

module.exports = interestsCalculation;