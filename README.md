# Proyecto de Pruebas con Cypress

Este proyecto utiliza Cypress para realizar pruebas en una aplicación web y se conecta a una base de datos Oracle utilizando la biblioteca `oracledb`. También se utiliza `dotenv` para cargar las variables de entorno desde un archivo `.env`, `ajv` para realizar comparativas de esquemas de las respuestas en formato `.json` y los valores obtenidos del consumo API, y `cypress-mochawesome-reporter` para generar reportes de ejecución.

## Instalación

1. Clona este repositorio en tu máquina local.

2. Abre una terminal y navega hasta la carpeta del proyecto.

3. Ejecuta el siguiente comando para instalar todas las dependencias:

```bash 
    npm install
```

4. Renombra el archivo `.env.template` a `.env` y actualiza las variables de entorno con los valores correspondientes para la conexión a la base de datos Oracle.

## Ejecución de Pruebas

1. Para abrir Cypress en modo de interfaz de usuario, ejecuta el siguiente comando:
```bash
    npx cypress open 
```
O alternativamente puedes usar el comando personalizado.
```bash
    npm run cy:open
```

   Esto abrirá la interfaz de usuario de Cypress, donde podrás seleccionar y ejecutar las pruebas manualmente.

2. Para ejecutar las pruebas en modo de línea de comandos, ejecuta el siguiente comando:
```bash
    npm run test
```
   Esto ejecutará las pruebas automáticamente y mostrará el resultado en la terminal.

## Cambio de Variables de Entorno

El archivo `.env` contiene las variables de entorno necesarias para la conexión a la base de datos Oracle. Para cambiar estas variables, sigue estos pasos:

1. Abre el archivo `.env` en un editor de texto.

2. Actualiza los valores de las variables `DB_USER`, `DB_PASSWORD` y `DB_CONNECT_STRING` con los valores correctos para tu entorno de base de datos.
```
    DB_USER=usuario
    DB_PASSWORD=clave
    DB_CONNECT_STRING=oracleDbHost
```


3. Guarda los cambios en el archivo.

## Reporte de Ejecución

Después de ejecutar las pruebas, se generará un reporte utilizando la biblioteca `cypress-mochawesome-reporter`. 
Podrá acceder al reporte de pruebas en la ruta [cypress/reports/html/index.html](cypress/reports/html/index.hml) desde la raíz del proyecto.

## Recomendación para utilizar ajv para validación de esquemas

Cuando estamos validando la estructura de las respuestas que se generan a partir del llamado de un API, se deben crear archivos de referencia que indiquen la obligatoriedad de los campos que recibimos, tipos de datos esperados, y estructura de la información, de la siguiente forma:

Imaginemos que al registrar un usuario por medio de un método POST, obtenemos la siguiente estructura:

```json
{
    "id": 4,
    "token": "QpwL5tke4Pnpja7X4"
}
```

Queremos validar la obligatoriedad del cumplimiento de su esquema, donde id, y token, son atributos obligatorios, y cada uno de ellos tienen tipos de datos `integer`, y `string` respectivamente, para lograrlo, debemos definir la estructura de la siguiente manera:

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "integer"
    },
    "token": {
      "type": "string"
    }
  },
  "required": [
    "id",
    "token"
  ]
}
```

Allí es donde entra en juego la validación que nos permite realizar la librería `ajv` respecto al tipo de datos y el cumplimiento del contrato (o esquema) de la respuesta obtenida.

Puedes hacer uso de herramientas que nos permitan crear los esquemas de forma automática como por ejemplo: https://www.liquid-technologies.com/online-json-to-schema-converter

## Ejecución de pruebas desde el Actions

Actualmente se tiene configurada la ejecución de pruebas E2E desde github (Actions) al momento de realizar un PR con los cambios de la rama feature/** o main/**.
Esto se realiza con el fin de estabilizar los escenarios creados a tiempo y que en caso de incurrir en ajustes se identifique en una etapa temprana.
```
Ruta del archivo .yml con la configuración: .github/workflows/main.yml
```