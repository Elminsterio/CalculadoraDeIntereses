function toHTML(calculation) {

    let tableTotalStr = '';

    tableTotalStr += '<tr>';

    let tableStr = `<th> Fecha de Inicio </th>\
                    <th> Fecha de Fin </th>\
                    <th> Intereses </th>\
                    <th> Tipo de Interés </th>\ 
                    <th> Días </th>`

    tableTotalStr += tableStr;
    tableTotalStr += '</tr>'

    // Se recibe un Map, con datos del usuario y los calculos como "calcualtions".
    // extraerlos aquí

    const onlyCalculations = calculation[1].calculation;
    for(let i = 0; i < onlyCalculations.length - 1; i++) {

        const {startDatePeriod, 
               endDatePeriod, 
               actualYearInterests, 
               annualInterestRate, 
               daysPerInterestsCycle} = onlyCalculations[i];
        
        tableTotalStr += '<tr>';
    
            tableStr = `<td>${startDatePeriod}</td>\
                        <td>${endDatePeriod}</td>\
                        <td>${actualYearInterests.toFixed(2)}</td>\
                        <td>${annualInterestRate}</td>\
                        <td>${daysPerInterestsCycle}</td> `
    
        tableTotalStr += tableStr;
        tableTotalStr += '</tr> ';
    }
    
    const finalCalculations = onlyCalculations[onlyCalculations.length - 1];  

    tableTotalStr = ` <div><h2 style="text-align: center"> ${calculation[1].title} </h2> <br> <table>` + tableTotalStr + '</table> </div>';
    
    tableTotalStr += `<table>\
    <tr>\
    <td> Cantidad </td>\
    <td> Intereses </td>\
    <td> Cantidad Total </td>\
    </tr>\
    <tr>\
    <td>${onlyCalculations[0].amount}</td>\
    <td>${finalCalculations.totalInterests.toFixed(2)}</td>\
    <td>${(onlyCalculations[0].amount + finalCalculations.totalInterests).toFixed(2)}</td>\
    </tr>\
    </table> `

    return tableTotalStr;

}

function HTMLFinalContent(calculations) {

    let content = '';

    for(let calculation of calculations) {
        
        if(typeof calculation[0] === 'string') continue;        
        
        content += toHTML(calculation);
    
        content += `<div style="page-break-after: always;"> </div>`;
    }

    return content;

}

module.exports = HTMLFinalContent;