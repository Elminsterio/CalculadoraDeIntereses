const dayjs = require('dayjs');
const isLeapYear = require('dayjs/plugin/isLeapYear');

dayjs.extend(isLeapYear);

const INTERESTS_RATE_PER_DATE = [
    {startInterestsDate: '1993',  annualInterestRate: 10.0},
    {startInterestsDate: '1994',  annualInterestRate: 9.00},
    {startInterestsDate: '1995',  annualInterestRate: 9.00},
    {startInterestsDate: '1996',  annualInterestRate: 9.00},
    {startInterestsDate: '1997',  annualInterestRate: 7.50},
    {startInterestsDate: '1998',  annualInterestRate: 5.50},
    {startInterestsDate: '1999',  annualInterestRate: 4.25},
    {startInterestsDate: '2000',  annualInterestRate: 4.25},
    {startInterestsDate: '2001',  annualInterestRate: 5.50},
    {startInterestsDate: '2002',  annualInterestRate: 4.25},
    {startInterestsDate: '2003',  annualInterestRate: 4.25},
    {startInterestsDate: '2004',  annualInterestRate: 3.75},
    {startInterestsDate: '2005',  annualInterestRate: 4.00},
    {startInterestsDate: '2006',  annualInterestRate: 4.00},
    {startInterestsDate: '2007',  annualInterestRate: 5.00},
    {startInterestsDate: '2008',  annualInterestRate: 5.50},
    {startInterestsDate: '2009',  annualInterestRate: 5.50},
    {startInterestsDate: ['2009', '4'], annualInterestRate: 4.00},
    {startInterestsDate: '2010',  annualInterestRate: 4.00},
    {startInterestsDate: '2011',  annualInterestRate: 4.00},
    {startInterestsDate: '2012',  annualInterestRate: 4.00},
    {startInterestsDate: '2013',  annualInterestRate: 4.00},
    {startInterestsDate: '2014',  annualInterestRate: 4.00},
    {startInterestsDate: '2015',  annualInterestRate: 3.50},
    {startInterestsDate: '2016',  annualInterestRate: 3.00},
    {startInterestsDate: '2017',  annualInterestRate: 3.00},
    {startInterestsDate: '2018',  annualInterestRate: 3.00},
    {startInterestsDate: '2019',  annualInterestRate: 3.00},
    {startInterestsDate: '2020',  annualInterestRate: 3.00},
    {startInterestsDate: '2021',  annualInterestRate: 3.00},
    {startInterestsDate: '2022',  annualInterestRate: 3.00}
];

let interestsCalculation = (initialDate, endDate, amount, type) => {


    switch(type) {

        case 'legal':

        return legalInterestsCalculation(initialDate, endDate, amount);

        case 'mora':

        return legalInterestsCalculation(initialDate, endDate, amount, 2);

    }

       
};

let legalInterestsCalculation = (initialDate, endDate, amount, differential = 0) => {

    
    let initialDateParsed = dateParserToDayJS(initialDate);
    let endDateParsed = dateParserToDayJS(endDate);
    
    let allPeriodsToOperate = INTERESTS_RATE_PER_DATE.filter(el => dayjs(el.startInterestsDate).get('year') >= initialDateParsed.get('year') && 
                                                                   dayjs(el.startInterestsDate).get('year') <= endDateParsed.get('year'));
    
    let totalInterests = 0;
    const calculation = [];
    
    while(allPeriodsToOperate.length > 0) {

        
        let daysPerInterestsCycle;
        let nextCycleDateParsed;

        const { startInterestsDate: actualCycleDate, annualInterestRate } = allPeriodsToOperate[0];
        const actualCycleDateParsed = dayjs(actualCycleDate);

        if(allPeriodsToOperate.length > 1) {
            const { startInterestsDate: nextCycleDate } = allPeriodsToOperate[1];  
            nextCycleDateParsed = dayjs(nextCycleDate)
    
            daysPerInterestsCycle = initialDateParsed.get('year') === actualCycleDateParsed.get('year') ?
                                    nextCycleDateParsed.get('month') !== 0 ?
                                    {days: nextCycleDateParsed.diff(initialDateParsed, 'days'), isInitial: true, isEnd: false} :
                                    {days: actualCycleDateParsed.add(1, 'year').diff(initialDateParsed, 'days'), isInitial: true, isEnd: false} :
                                    {days: nextCycleDateParsed.diff(actualCycleDateParsed, 'days'), isInitial: false, isEnd: false};

        } else if(allPeriodsToOperate.length === 1) {
            daysPerInterestsCycle = initialDateParsed.get('year') === endDateParsed.get('year') &&
                                    actualCycleDateParsed.get('month') === 0 ?
                                    {days: endDateParsed.diff(initialDateParsed, 'days'), isInitial: true, isEnd: true} :
                                    {days: endDateParsed.diff(actualCycleDateParsed, 'days') + 1, isInitial: false, isEnd: true};

        }

        const totalDaysActualYear = actualCycleDateParsed.isLeapYear() ? 366 : 365;
        const ratePerDay = ((annualInterestRate + differential)/100)/totalDaysActualYear;

        const interestsCycle = (amount * ratePerDay * daysPerInterestsCycle.days);

        totalInterests += interestsCycle;
        
        calculation.push({actualYearInterests: interestsCycle, 
                      daysPerInterestsCycle: daysPerInterestsCycle.days, 
                      amount, 
                      annualInterestRate, 
                      startDatePeriod: daysPerInterestsCycle.isInitial ? 
                                       initialDateParsed.format('DD/MM/YYYY') : 
                                       actualCycleDateParsed.format('DD/MM/YYYY'), 
                      endDatePeriod: daysPerInterestsCycle.isEnd ? 
                                     endDateParsed.format('DD/MM/YYYY') : 
                                     nextCycleDateParsed.subtract(1, 'days').format('DD/MM/YYYY') 
        });

        allPeriodsToOperate.splice(0, 1);
    }

    calculation.push({ totalInterests })

    return calculation;
}

let dateParserToDayJS = function(date) {

    const [ day, month, year ] = date.split('/');

    return dayjs(`${month} ${day} ${year}`)

}

module.exports = interestsCalculation;