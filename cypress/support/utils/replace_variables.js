Cypress.Commands.add('replaceVariables', (request, variables) => {
  // Función auxiliar recursiva para reemplazar variables en un objeto
  const replaceVariablesRecursive = (obj) => {
      if (typeof obj === 'object') {
          // Recorre todas las propiedades del objeto
          for (const key in obj) {
              if (obj.hasOwnProperty(key)) {
                  // Si la propiedad es un objeto, aplica la recursión
                  if (typeof obj[key] === 'object') {
                      obj[key] = replaceVariablesRecursive(obj[key]);
                  } else if (typeof obj[key] === 'string') {
                      // Si la propiedad es una cadena y no es una fecha ni está entre comillas dobles, realiza el reemplazo de variables
                      if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(obj[key]) && !/^".*"$/.test(obj[key])) {
                          obj[key] = obj[key].replace(/{{(\w+)}}/g, (_, variable) => variables[variable] || '');

                          // Tratamiento especial para la propiedad que parece un objeto JSON
                          try {
                              // Intenta analizar la cadena como un objeto JSON
                              const parsedJson = JSON.parse(obj[key]);
                              if (typeof parsedJson === 'object') {
                                  obj[key] = parsedJson;
                              }
                          } catch (error) {
                              // La cadena no es un objeto JSON válido, continúa con el reemplazo normal
                          }
                      }
                  }
              }
          }
      }
      return obj;
  };

  // Clona el objeto para evitar modificar el original
  const clonedRequest = JSON.parse(JSON.stringify(request));

  // Aplica la sustitución de variables recursiva en el objeto clonado
  const replacedRequest = replaceVariablesRecursive(clonedRequest);

  return replacedRequest;
});
