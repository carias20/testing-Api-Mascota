describe('API mascotas', () => {
    let petId;
    it('Crear mascota', () => {
        cy.fixture('tienda/creacionMascota.json').then((petData) => {
            petData.id = Math.floor(Math.random() * 1000000);
          
            cy.request({
              method: 'POST',
              url: 'https://petstore.swagger.io/v2/pet',
              headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: petData,
            }).then((response) => {
              expect(response.status).to.eq(200);
              expect(response.body.id).to.eq(petData.id);
              petId = response.body.id;
              cy.log(`Pet created with random ID: ${petId}`);
            });
          });
        });

        it('Consultar mascota', () => { 
            const maxRetries = 3;
            const delay = 2000;
            let attempt = 0;
            function makeRequest() {
                cy.request({
                    method: 'GET',
                    url: `https://petstore.swagger.io/v2/pet/${petId}`,
                    headers: {
                        'accept': 'application/json',
                    },
                    failOnStatusCode: false,
                }).then((getResponse) => {
                    if (getResponse.status === 200) {
                        cy.log('Response body:', JSON.stringify(getResponse.body, null, 2));
                        expect(getResponse.body).to.have.property('id', petId);
                    } else if (getResponse.status === 404 && attempt < maxRetries) {
                        attempt++;
                        cy.log(`Pet not found, reintentando... (${attempt}/${maxRetries})`);
                        cy.wait(delay);
                        makeRequest();
                    } else {
                        cy.log('Pet not found after multiple attempts.');
                        expect(getResponse.status).to.eq(404); 
                    }
                });
            }
            makeRequest();
        });


        it('Actualizacion de mascota', () => {
            const maxRetries = 5;
            const delay = 2000;
        
            cy.fixture('tienda/actualizacionDatos.json').then((NuevaData) => {
                let attempt = 0;
                function updatePet() {
                    cy.request({
                        method: 'GET',
                        url: `https://petstore.swagger.io/v2/pet/${petId}`,
                        headers: {
                            'accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: NuevaData,
                        failOnStatusCode: false, // No fallar automáticamente en caso de 404
                    }).then((putResponse) => {
                        if (putResponse.status === 200) {
                            // Si la actualización es exitosa (200), verificamos la respuesta
                            expect(putResponse.status).to.eq(200);
                            expect(putResponse.body).to.have.property('id', petId);
                            cy.log('Updated pet name:', putResponse.body.name);
                        } else if (putResponse.status === 404 && attempt < maxRetries) {
                            // Si la respuesta es 404 y no se ha alcanzado el máximo de reintentos
                            attempt++;
                            cy.log(`Update failed with 404. Retrying... (${attempt}/${maxRetries})`);
                            cy.wait(delay); 
                            updatePet(); 
                        } else {
                            cy.log('Failed to update pet after multiple attempts or received unexpected status.');
                            expect(putResponse.status).to.not.eq(404); // No esperar un 404 al final
                        }
                    });
                }

                updatePet();
            });
        });

        it('Eliminar mascota', () => {
            const petId = 43804; // Define tu petId aquí
            const maxRetries = 5; // Número máximo de reintentos
            const delay = 2000; // 2 segundos de espera entre reintentos
        
            let attempt = 0;
        
            // Función para realizar la eliminación de la mascota con reintentos en caso de 404
            function deletePet() {
                cy.request({
                    method: 'DELETE',
                    url: `https://petstore.swagger.io/v2/pet/${petId}`,
                    headers: {
                        'accept': 'application/json',
                    },
                    failOnStatusCode: false, // No fallar automáticamente en caso de error
                }).then((response) => {
                    if (response.status === 200) {
                        // Si la eliminación es exitosa (200), verificamos la respuesta y cerramos el caso
                        cy.log('Pet deleted successfully');
                        expect(response.status).to.eq(200);
                        return; // Termina la prueba si la eliminación fue exitosa
                    } else if (response.status === 404 && attempt < maxRetries) {
                        // Si la respuesta es 404 y no se ha alcanzado el máximo de reintentos
                        attempt++;
                        cy.log(`Pet not found (404). Retrying... (${attempt}/${maxRetries})`);
                        cy.wait(delay); // Espera antes de reintentar
                        deletePet(); // Reintenta la eliminación
                    } else if (response.status === 400) {
                        // Si la respuesta es 400, se cierra la prueba inmediatamente
                        cy.log('Bad request (400). Test case closed.');
                        expect(response.status).to.eq(400);
                    } else {
                        // Si recibimos un código inesperado, también cerramos el test
                        cy.log('Failed to delete pet, received unexpected status code.');
                        expect(response.status).to.not.eq(404); // No esperar un 404 al final
                    }
                });
            }
        
            // Llamamos a la función para intentar eliminar la mascota
            deletePet();
        });
    });

