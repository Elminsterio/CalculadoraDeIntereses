let calculationObjectPrompts = {
    fileNumber: {
        name: 'fileNumber',
        message: 'Introduce el número del expediente: ',
        validate: response => {
            if(Number.isInteger(Number(response)) && Number(response) > 0) {
                return true;
            }
            return 'El valor introducido no es una cantidad o no es un entero (no introducir símbolos ni puntos) ';
        }
    },
    numberOfCalculations: {
        type: 'number',
        name: 'numberOfCalculations',
        message: 'Introduce la cantidad de cálculos de intereses: ',
        validate: async response => {
            if(0 < response < 14 && Number.isInteger(Number(response))) {
                return true;
            }
            return 'No puede exceder de 13 cálculos o tener letras '
        }
    },
    typeInterestsRate: {
        name: 'typeInterestsRate',
        message: 'Introduce el tipo de interés aplicable (legal o mora): ',
        type: 'list',
        choices: [
            'legal',
            'mora',
            'personalizado'
        ]
    },
    customInterestsRate: {
        name: 'customInterestsRate',
        message: 'Introduce el tipo de interés: ',
        validate: async response => {
            if(Number(response)) {
                return true;
            }
            return 'El valor introducido debe ser un número'
        }
    },
    title: {
        name: 'title',
        message: 'Introduce el título de la tabla: ',
        validate: async response => {
            if(response.length < 20) {
                return true;
            }
            return 'El título excede de los 20 carácteres, reintrodúzcalo ';
        }
    },
    initialDate: {
        name: 'initialDate',
        message: 'Introduce la fecha inicial (dd/mm/aaaa): ',
        validate: async response => {
            if(/(?:3[01]|[12][0-9]|0?[1-9])([\/])(0?[1-9]|1[0-2])\1\d{4}$/.test(response)) {
                return true;
            }
            return 'Por favor, introduce la fecha en formato dd/mm/aaaa ';
        }
    },
    endDate: {
        name: 'endDate',
        message: 'Introduce la fecha final (dd/mm/aaaa): ',
        validate: async response => {
            if(/(?:3[01]|[12][0-9]|0?[1-9])([\/])(0?[1-9]|1[0-2])\1\d{4}$/.test(response)) {
                return true;
            }
            return 'Por favor, introduce la fecha en formato dd/mm/aaaa: ';
        }
    },
    amount: {
        name: 'amount',
        message: 'Introduce la cantidad: ',
        filter: response => Number(response.replace(/,/g, '.')),
        validate: async response => {
            if(Number(response) > 0) {
                return true;
            }
            return 'El valor introducido no es una cantidad (no introducir símbolos ni puntos) ';
        }
    },
    isCorrect: {
        name: 'isCorrect',
        message: '¿Son correctos los datos introducidos?',
        type: 'confirm',
        default: true,
        transform: response => (response === 'si' || response === '' || response === 'Sí') ? true : false
    },
    elementsToCorrect: {
        name: 'elementToCorrect',
        message: 'Introduce el elemento a modificar: ',
        type: 'checkbox',
        choices: [
            'Título de la tabla',
            'Fecha inicial de calculo',
            'Fecha final de calculo',
            'Cantidad'
        ],
        filter: response => {
            return response.map(value => {
                if(value === 'Título de la tabla') return 'title';
                if(value === 'Fecha inicial de calculo') return 'initialDate';
                if(value === 'Fecha final de calculo') return 'endDate';
                if(value === 'Cantidad') return 'amount';
            })
        }
    },
    writingToCourt: {
        name: 'writingToCourt',
        message: '¿Desea expedir escrito dirigido al juzgado?',
        type: 'confirm',
        default: false,
        filter: response => (response === 'si' || response === '' || response === 'Sí') ? true : false
    }
};

module.exports = calculationObjectPrompts;