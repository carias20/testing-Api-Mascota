import Ajv from 'ajv';
const ajv = new Ajv();

Cypress.Commands.add('schemeValidation', (respuestaObtenida, esquemaEsperado) => {
    const validate = ajv.compile(esquemaEsperado);
    const valid = validate(respuestaObtenida.body);
    // Realiza una aserción para verificar si la respuesta cumple con el esquema
    expect(valid).to.be.true;
    cy.log("validación exitosa: la respuesta obtenida cumple el esquema esperado")
})