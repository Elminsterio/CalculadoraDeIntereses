
const interestsCalculation = require('./modulos/legalInterestsCalculator');

function toHTML(initialDate, endDate, amount, typeInterestsRate, title) {

    let arrCalculados = interestsCalculation(initialDate, endDate, amount, typeInterestsRate);
    console.log(arrCalculados);
    let tableTotalStr = '';

    tableTotalStr += '<tr>';

    let tableStr = `<th> Fecha de Inicio </th>\
                    <th> Fecha de Fin </th>\
                    <th> Intereses </th>\
                    <th> Tipo de Interés </th>\ `

    tableTotalStr += tableStr;
    tableTotalStr += '</tr>'

    for(let i = 0; i < arrCalculados.length - 1; i++) {

        tableTotalStr += '<tr>';

            tableStr = `<td>${initialDate}</td>\
                        <td>${endDate}</td>\
                        <td>${amount}</td>\
                        <td>${typeInterestsRate}</td>\ `

        tableTotalStr += tableStr;
        tableTotalStr += '</tr> ';

    }

    tableTotalStr = ` <div><h2 style="text-align: center"> ${title} </h2> <br> <table>` + tableTotalStr + '</table> </div>';
    tableTotalStr += `<table>\
    <tr>\
    <td> Cantidad </td>\
    <td> Intereses </td>\
    <td> Cantidad Total </td>\
    </tr>\
    <tr>\
    <td>${amount}</td>\
    <td>${amount}</td>\
    <td>${amount}</td>\
    </tr>\
    </table> `

    return tableTotalStr;

}

function HTMLFinalContent(calculations) {

    let content = '';

    for(let calculation of calculations) {
        console.log(calculation[1]);
        content += toHTML(calculation[1].initialDate, calculation[1].endDate, calculation[1].amount, calculation[1].typeInterestsRate, calculation[1].title);
    }

    content += `<div style="page-break-after: always;"> </div>`;

    return content;

}

module.exports = HTMLFinalContent;