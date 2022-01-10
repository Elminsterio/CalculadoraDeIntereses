
const calcularInteresA = require('./modulos/calculadoraLegal');


function toHTML(fechaIni, FechaFin, cantidad, tipoInt, titulo) {

    let arrCalculados = calcularInteresA(fechaIni, FechaFin, cantidad, tipoInt);
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

            tableStr = `<td>${arrCalculados[i][1]}</td>\
                        <td>${arrCalculados[i][2]}</td>\
                        <td>${arrCalculados[i][3]}</td>\
                        <td>${arrCalculados[i][4]}</td>\ `

        tableTotalStr += tableStr;
        tableTotalStr += '</tr> ';

    }

    tableTotalStr = ` <div><h2 style="text-align: center"> ${titulo} </h2> <br> <table>` + tableTotalStr + '</table> </div>';
    tableTotalStr += `<table>\
    <tr>\
    <td> Cantidad </td>\
    <td> Intereses </td>\
    <td> Cantidad Total </td>\
    </tr>\
    <tr>\
    <td>${arrCalculados[arrCalculados.length - 1][0]}</td>\
    <td>${arrCalculados[arrCalculados.length - 1][1]}</td>\
    <td>${arrCalculados[arrCalculados.length - 1][2]}</td>\
    </tr>\
    </table> `

    return tableTotalStr;

}

function HTMLFinalContent(fechaIniArr, FechaFinArr, cantidadArr, tipoIntArr, tituloArr) {

    let content = '';

    for(let i = 0; i < fechaIniArr.length; i++) {

        content += toHTML(fechaIniArr[i], FechaFinArr[i], cantidadArr[i], tipoIntArr[i], tituloArr[i]);

        if(i < fechaIniArr.length - 1) content += `<div style="page-break-after: always;"> </div>`;

    }

    return content;

}

module.exports = HTMLFinalContent;