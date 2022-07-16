function toHTML(calculations) {

  let tableTotalStr = '<tr></th><th style="text-align: center" colspan="6">Con suelo</th><th style="text-align: center" colspan="5">Sin suelo</th></tr>';

  tableTotalStr += '<tr>';

  let tableStr = `<th> Fecha de cuota </th>
                  <th> Cuota total </th>
                  <th> Intereses </th> 
                  <th> Principal </th>
                  <th> Capital restante </th>
                  <th> Tipo de interes aplicado </th>
                  <th> Cuota total sin suelo </th>
                  <th> Intereses sin suelo </th>
                  <th> Principal sin suelo </th>
                  <th> Capital restante </th>
                  <th> Tipo de interés sin suelo </th>
                  <th> Diferencia intereses </th>`

  tableTotalStr += tableStr;
  tableTotalStr += '</tr>'

  const { amortizationWithoutFloor, amortizationWithFloor, diferences } = calculations;
  
  for(let i = 0; i < amortizationWithoutFloor.length - 1; i++) {    
    const {actualRate, monthTotal, monthPrincipal, monthInterests,
           remainQuantity, initialDate, monthDiferenceInterests } = amortizationWithFloor[i];
    const {actualRate: rateWithoutFloor, monthTotal: monthWithoutFloor, monthPrincipal: monthPrincipalWithoutFloor, 
           monthInterests: monthInterestsWithoutFloor, remainQuantity: remainQuantityWithoutFloor } = amortizationWithoutFloor[i];

    tableTotalStr += '<tr>';

        tableStr = `<td>${initialDate}</td>
                    <td>${monthTotal.toFixed(2)}</td>
                    <td>${monthInterests.toFixed(2)}</td>
                    <td>${monthPrincipal.toFixed(2)}</td>
                    <td>${remainQuantity.toFixed(2)}</td>
                    <td>${actualRate.toFixed(2)}</td>
                    <td>${monthWithoutFloor.toFixed(2)}</td>
                    <td>${monthInterestsWithoutFloor.toFixed(2)}</td>
                    <td>${monthPrincipalWithoutFloor.toFixed(2)}</td>
                    <td>${remainQuantityWithoutFloor.toFixed(2)}</td>
                    <td>${rateWithoutFloor.toFixed(2)}</td>
                    <td>${monthDiferenceInterests.toFixed(2)}</td>`

    tableTotalStr += tableStr;
    tableTotalStr += '</tr> ';
  }
  
  tableTotalStr = ` <div><table>` + tableTotalStr + '</table></div>';
  
  tableTotalStr += `<table>
  <tr>
  <td> Total diferencia intereses  </td>
  <td> Total capital amortizado de menos </td>
  <td> Cantidad indemnización </td>
  </tr>
  <tr>
  <td>${diferences.diferenceInterests}</td>
  <td>${diferences.diferencePrincipal}</td>
  <td>${diferences.diferenceInterests + diferences.diferencePrincipal}</td>
  </tr>
  </table> `

  return tableTotalStr;
}

module.exports = toHTML;