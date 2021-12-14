# Calculadora de intereses moratorios

# Tabla de contenidos

1. [Introducción](#introduction)
2. [Requisitos para la instalación](#requisitos)
3. [Guía para la instalación](#instalacion)
4. [Guía de uso](#uso)
5. [To DO](#do)

## Introducción <a name="introduction"></a>

Se trata de una aplicación de consola para realizar el cálculo de los intereses moratorios devengados en una deuda. Por ahora, se implementa únicamente el cálculo de los intereses legales y de mora procesal conforme el ordenamiento jurídico español.

El cálculo de los intereses legales procede su cálculo, conforme el artículo 1100 del Código Civil español, desde la intimación al deudor (recepción de Burofax) o, en su defecto, desde la interposición de la demanda.

La mora procesal, procederá conforme lo establecido en el artículo 576 de la Ley de Enjuiciamiento Civil.

La aplicación genera un documento ".docx" con los cálculos realizados, adicionalmente si se solicita, se generará un escrito para solicitar los intereses dirigido al juzgado.

## Requisitos para la instalación <a name="requisitos"></a>

1. Nodejs instalado

## Guía para la instalación <a name="instalacion"></a>

Una vez clonado el repositorio en local, instalar las dependencias con el comando:

`npm install`

## Guía de uso <a name="uso"></a>

Se ejecutará la aplicación mediante `node index.js`.

Al ejecutar la aplicación se preguntará sobre el número de expediente al que estará asignada la liquidación.  

Tras ello, se preguntará la cantidad de cálculos a realizar (no puede exceder de 13).

En cada cálculo, se preguntará por el tipo de cálculo, el título de la tabla, fecha inicial y final de cálculo y la cantidad.

Tras los cálculos, se expedirá un documento ".docx" con la tabla y los cálculos y se podrá solicitar que se expida escrito dirigido al juzgado con las cantidades.

## To DO <a name="do"></a>

Respecto a las funcionalidades previstas a añadir:

- Cálculo de interés simple personalizado.
- Cálculo de interés de mora en operaciones comerciales (artículo 8 Ley 3/2004, de 29 de diciembre) y en seguros (artículo 20 Ley 50/1980, de 8 de octubre).
- Actualización automática de los tipos de interés mediante API oficial.
