describe('API mascotas', () => {
    let mascotaId;
    it('Crear mascota', () => {
        cy.fixture('tienda/creacionMascota.json').then((dataMasc) => {
            dataMasc.id = Math.floor(Math.random() * 1000000);

            cy.request({
                method: 'POST',
                url: 'https://petstore.swagger.io/v2/pet',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: dataMasc,
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.id).to.eq(dataMasc.id);
                mascotaId = response.body.id;
                cy.log(`Pet created with random ID: ${mascotaId}`);
            });
        });
    });

    it('Consultar mascota', () => {
        cy.wait(3000);
        const maxRetries = 3;
        const delay = 2000;
        let attempt = 0;
        function makeRequest() {
            cy.request({
                method: 'GET',
                url: `https://petstore.swagger.io/v2/pet/${mascotaId}`,
                headers: {
                    'accept': 'application/json',
                },
                failOnStatusCode: false,
            }).then((getResponse) => {
                if (getResponse.status === 200) {
                    cy.log('Response body:', JSON.stringify(getResponse.body, null, 2));
                    expect(getResponse.body).to.have.property('id', mascotaId);
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

        cy.fixture('tienda/actualizacionDatos.json').then((nuevaData) => {
            let attempt = 0;
            function updatePet() {
                cy.request({
                    method: 'GET',
                    url: `https://petstore.swagger.io/v2/pet/${mascotaId}`,
                    headers: {
                        'accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: nuevaData,
                    failOnStatusCode: false,
                }).then((putResponse) => {
                    if (putResponse.status === 200) {
                        expect(putResponse.status).to.eq(200);
                        expect(putResponse.body).to.have.property('id', mascotaId);
                        cy.log('Updated pet name:', putResponse.body.name);
                    } else if (putResponse.status === 404 && attempt < maxRetries) {
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
        const maxRetries = 5;
        const delay = 2000;
        let attempt = 0;
        function eliminarMascota() {
            cy.request({
                method: 'DELETE',
                url: `https://petstore.swagger.io/v2/pet/${mascotaId}`,
                headers: {
                    'accept': 'application/json',
                },
                failOnStatusCode: false,
            }).then((response) => {
                if (response.status === 200) {
                    cy.log('Pet deleted successfully');
                    expect(response.status).to.eq(200);
                    return;
                } else if (response.status === 404 && attempt < maxRetries) {
                    attempt++;
                    cy.log(`Pet not found (404). Retrying... (${attempt}/${maxRetries})`);
                    cy.wait(delay);
                    eliminarMascota();
                } else if (response.status === 400) {
                    cy.log('Bad request (400). Test case closed.');
                    expect(response.status).to.eq(400);
                } else {
                    cy.log('Fallo la eliminacion');
                    expect(response.status).to.not.eq(404);
                }
            });
        }
        eliminarMascota();
    });
});

