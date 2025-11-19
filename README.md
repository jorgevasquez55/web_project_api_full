# Tripleten web_project_api_full

Link de acceso
](https://loyal-gateway-409318.web.app/signup)
Descripción general

Este proyecto tiene como objetivo poner en práctica el desarrollo back-end, es decir, trabajar del lado del servidor. Aquí implementé diversas tecnologías y un framework central para construir la lógica del servidor, gestionar datos, manejar solicitudes y respuestas HTTP, y realizar otras tareas esenciales en un entorno backend.

Node.js

Node.js es un entorno de ejecución que permite correr JavaScript del lado del servidor. En este proyecto lo utilicé para crear el servidor web y manejar toda la lógica que ocurre detrás de la interfaz.

Módulos de Node.js

Los módulos en Node.js permiten dividir el código en partes más pequeñas y reutilizables. Son fundamentales para mantener la aplicación organizada, especialmente cuando crece en complejidad.

Sistema de archivos (módulo fs)

El módulo fs permite acceder y manipular el sistema de archivos del servidor. Proporciona métodos para leer, crear, modificar o eliminar archivos, lo que resulta útil para múltiples operaciones dentro del proyecto.

Framework Express

Express es un framework minimalista y flexible para construir aplicaciones web y APIs sobre Node.js. Facilita enormemente el manejo de rutas, middleware y respuestas HTTP.

Enrutamiento

Express simplifica la creación de rutas para manejar solicitudes como GET, POST, PUT o DELETE. Esto permite estructurar la aplicación de manera ordenada y asignar controladores específicos para cada endpoint.

Middleware

El middleware permite ejecutar funciones intermedias durante el ciclo de vida de una solicitud. Puede realizar tareas como:

registro de actividad (logging),

validación de datos,

autenticación y autorización,

manejo de errores,

manipulación de la solicitud o la respuesta.

Este sistema modular es una de las mayores fortalezas de Express.

Manejo de solicitudes y respuestas

Express facilita enviar respuestas JSON, configurar encabezados, procesar la entrada del usuario y servir archivos estáticos, entre otros.

Postman

Postman es una herramienta para probar APIs y servicios web. Permite enviar solicitudes HTTP como GET, POST, PUT o DELETE y observar las respuestas del servidor. Fue muy útil para validar la funcionalidad de cada endpoint durante el desarrollo.

MongoDB

MongoDB es una base de datos NoSQL orientada a documentos. Ofrece flexibilidad, escalabilidad y un modelo de datos muy intuitivo para desarrolladores. Gracias a su estructura basada en documentos, resulta ideal para trabajar con información dinámica.

Esquemas de validación

En este proyecto utilicé Mongoose, cuya funcionalidad principal incluye definir Schemas.
Los Schemas determinan la estructura de los documentos dentro de las colecciones: tipos de datos, campos requeridos y reglas de validación. Esto permite mantener la integridad de los datos y asegurar que cada documento cumpla un formato específico.

CRUD

Las operaciones CRUD (Create, Read, Update, Delete) son la base de cualquier sistema de gestión de datos. En este proyecto implementé estas operaciones para manipular los recursos desde la API, permitiendo crear, consultar, modificar y eliminar información.

Expresiones regulares

Las expresiones regulares (regex) son patrones utilizados para validar o manipular texto. En este proyecto fueron útiles para validar campos como URLs, correos electrónicos y otros datos que requieren un formato específico.

Manejo de errores

El manejo adecuado de errores es clave para que una aplicación sea estable y confiable. Un error no controlado puede derribar el servidor completo. Por eso, implementé un sistema de manejo centralizado que permite detectar, capturar y responder errores sin comprometer el funcionamiento general de la API.
