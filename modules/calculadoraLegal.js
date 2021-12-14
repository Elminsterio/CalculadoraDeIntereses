const interesLegal = [

    [new Date(2021,0,1), 3.00],
    [new Date(2020,0,1), 3.00],
    [new Date(2019,0,1), 3.00],
    [new Date(2018,0,1), 3.00],
    [new Date(2017,0,1), 3.00],
    [new Date(2016,0,1), 3.00],
    [new Date(2015,0,1), 3.50],
    [new Date(2014,0,1), 4.00],
    [new Date(2013,0,1), 4.00],
    [new Date(2012,0,1), 4.00],
    [new Date(2011,0,1), 4.00],
    [new Date(2010,0,1), 4.00],
    [new Date(2009,3,1), 4.00],
    [new Date(2009,0,1), 5.50],
    [new Date(2008,0,1), 5.50],
    [new Date(2007,0,1), 5.00],
    [new Date(2006,0,1), 4.00],
    [new Date(2005,0,1), 4.00],
    [new Date(2004,0,1), 3.75],
    [new Date(2003,0,1), 4.25],
    [new Date(2002,0,1), 4.25],
    [new Date(2001,0,1), 5.50],
    [new Date(2000,0,1), 4.25],
    [new Date(1999,0,1), 4.25],
    [new Date(1998,0,1), 5.50],
    [new Date(1997,0,1), 7.50],
    [new Date(1996,0,1), 9.00],
    [new Date(1995,0,1), 9.00],
    [new Date(1994,0,1), 9.00],
    [new Date(1993,0,1), 10.00]
    

];


let calcularInteresA = (fechaIni, fechaFin, cantidad, tipo) => {

    let fechaIniEnArr = fechaIni.includes('/') ? fechaIni.split('/') : fechaIni.split('-');
    let fechaFinEnArr = fechaFin.includes('/') ? fechaFin.split('/') : fechaFin.split('-');

    fechaIniOnDate = new Date(fechaIniEnArr[2], fechaIniEnArr[1] - 1, fechaIniEnArr[0]);
    fechaFinOnDate = new Date(fechaFinEnArr[2], fechaFinEnArr[1] - 1, fechaFinEnArr[0]);

    switch(tipo) {

        case 'legal':

        return calcularInteresLegales(fechaIniOnDate, fechaFinOnDate, cantidad);

        case 'mora':

        return calcularInteresLegales(fechaIniOnDate, fechaFinOnDate, cantidad, 2);

    };

       
};

let calcularInteresLegales = (fechaIni, fechaFin, cantidad, diferencial = 0) => {

    cantidad = Number(cantidad);
    let meses = calculadoraMeses(fechaIni, fechaFin);
    console.log(meses);
    let anioInicio = fechaIni.getFullYear();
    let mesInicio = fechaIni.getMonth();

    let fechaSiguiente = new Date(anioInicio, mesInicio + 1, 0)

    let calculo = [];
    let intAnio = 0;
    let diasAnio = 0;
    let intTotal = 0;
    let tipoAnual = calcularTipo(anioInicio, mesInicio, interesLegal)[1] + diferencial;
    console.log(tipoAnual);
    let fechaBaseFormateado = `${fechaIni.getDate()}/${fechaIni.getMonth() + 1}/${fechaIni.getFullYear()}`;

    for(let i = 0; i < meses; i++) {

        let dias = i == meses - 1 ? fechaFin.getDate() : fechaSiguiente.getDate() - (fechaIni.getDate() - 1);
        console.log(anioInicio,mesInicio);
        // Pendiente de establecer el tipo aplicable
        const arrTipoFecha = calcularTipo(anioInicio, mesInicio, interesLegal)
        const tipoAnualAplic = arrTipoFecha[1] + diferencial;
        
        // "Inversión inicial" * (1 + "la tasa de interés anual" / "los periodos compuestos por año") ^ ("días").
        
        const tipoDiarioDecimal = (tipoAnualAplic/100)/bisiesto(fechaSiguiente.getFullYear());

        const formulaSinPpal = (cantidad * tipoDiarioDecimal * dias);

        mesInicio += 1;
        intAnio += Number(formulaSinPpal);
        diasAnio += dias;

        
            if(tipoAnualAplic != tipoAnual && mesInicio < 11) {

                fechaBaseFormateado = `${fechaIni.getDate()}/${fechaIni.getDate()}/${fechaIni.getFullYear()}`;

                const fechaSiguienteFormateado = `${fechaSiguiente.getDate()}/${fechaSiguiente.getMonth() + 1}/${fechaSiguiente.getFullYear()}`;
                
                calculo.push([(cantidad + intAnio).toFixed(2), fechaBaseFormateado, fechaSiguienteFormateado, intAnio.toFixed(2), tipoAnualAplic, diasAnio]);

                fechaIni.setMonth(mesInicio, 1);
                fechaSiguiente.setMonth(mesInicio + 1, 1);

                fechaBaseFormateado = `${fechaSiguiente.getDate()}/${fechaSiguiente.getMonth()}/${fechaSiguiente.getFullYear()}`;

                diasAnio = 0;
                intAnio = 0;

                tipoAnual = calcularTipo(anioInicio, mesInicio + 1, interesLegal)[1] + diferencial;

            }

            if(mesInicio > 11) {

                const fechaSiguienteFormateado = `${fechaSiguiente.getDate()}/${fechaSiguiente.getMonth() + 1}/${fechaSiguiente.getFullYear()}`;
                
                tipoAnual = calcularTipo(anioInicio, mesInicio + 1, interesLegal)[1] + diferencial;

                mesInicio = 0;
                anioInicio += 1;

                fechaIni.setFullYear(anioInicio);
                fechaIni.setMonth(mesInicio);
                fechaIni.setDate(1);

                fechaSiguiente.setFullYear(anioInicio);
                fechaSiguiente.setMonth(mesInicio);
                fechaSiguiente.setDate(31);
                calculo.push([(cantidad + intAnio).toFixed(2), fechaBaseFormateado, fechaSiguienteFormateado, intAnio.toFixed(2), tipoAnual, diasAnio]);

                diasAnio = 0;
                intAnio = 0;
                
                fechaBaseFormateado = `${fechaIni.getDate()}/${fechaIni.getMonth() + 1}/${fechaIni.getFullYear()}`;

            } else if (i === meses - 1) {

                const fechaFinFormateado = `${fechaFin.getDate()}/${fechaFin.getMonth() + 1}/${fechaFin.getFullYear()}`;
                calculo.push([(cantidad + intAnio).toFixed(2), fechaBaseFormateado, fechaFinFormateado, intAnio.toFixed(2), tipoAnualAplic, diasAnio]);

                tipoAnual = calcularTipo(anioInicio, mesInicio + 1, interesLegal)[1] + diferencial;

            } else {

                fechaIni.setMonth(mesInicio, 1);
                fechaSiguiente.setMonth(mesInicio + 1, 0);

                tipoAnual = calcularTipo(anioInicio, mesInicio + 1, interesLegal)[1] + diferencial;
            }
            
    };
    
    for(let i = 0; i < calculo.length; i++) {

        intTotal += Number(calculo[i][3]);

    }

    calculo.push([cantidad, intTotal.toFixed(2), (cantidad + intTotal).toFixed(2), calculo[0][1], calculo[calculo.length - 1][2]]);

    console.log(calculo);
    return calculo;

}

let bisiesto = (fecha) => {

    if(fecha % 4) {

        return 365;

    } else {

        return 366;
    } 
}

let calculadoraMeses = (fecha1, fecha2) => {

    const mesAnio1 = fecha1.getMonth();
    
    let mesesTranscurridos1 = 13 - mesAnio1;
    
    const mesAnio2 = fecha2.getMonth();

    let mesesAniosEnteros = (fecha2.getFullYear() - (fecha1.getFullYear() + 1)) * 12;

    console.log(mesesAniosEnteros, mesesTranscurridos1)

    return mesesAniosEnteros + mesesTranscurridos1 + mesAnio2;

}

let calcularTipo = (anio, mes, arr) => {
    
    console.log(anio)

    let nArr = arr.filter(e => e[0].getFullYear() == anio);
    console.log(nArr);
    if(nArr.length === 1) {

        return nArr[0];

    } else if (nArr.length === 2) {

        let mes1 = nArr[0][0].getMonth();
        let mes2 = nArr[1][0].getMonth();


        if(mes1 - mes2 < 0) {

            // mes1 es mayor que mes2

            if (mes < mes2) return nArr[1];
        } 

        if(mes2 - mes1 < 0) {

            // mes1 es mayor que mes2

            if (mes < mes1) return nArr[1];
            if (mes >= mes2) return nArr[0];
        }

    }
    


}

module.exports = calcularInteresA;