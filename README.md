# Trabajo de fin de Grado - Analisis, diseño y implementación de una aplicación web para la gestión de eventos deportivos
## Preparación para la ejecución de la aplicación
### Backend
- Se debe crear un entorno virtual dentro de `backend/` para poder alamacenar en él las dependencias del proyecto (para no ternerlas de manera local). Una vez creado se activa y se instalan en el las librerias necesarias (que se encuentran en requirements.txt). Los comandos a utilizar son los siguientes:  
`python -m venv venv`  
`source venv/bin/activate` **(MAC o LINUX)**  
`venv/Scripts/activate` **(WINDOWS)**  
- Una vez hecho esto dentro del directorio `backend/` arrancamos el servidor: `uvicorn main:app --reload`  
### Frontend
- Nos situamos en `frontend/event-register/` y ejecutamos los siguientes comandos:  
`npm install` **Necesario para instalar las librerias basicas de NextJS**  
`npm install @radix-ui/themes` **Libreria de react usada para el diseño de la ui**   
`npm install @radix-ui/react-icons`  
`npm install @radix-ui/react-avatar`  
`npm install radix-themes-tw postcss-import --dev` **Para que funcione la configuracion del Tailwind**  
- Para ejecutar el frontend usamos el siguiente comando:  
`npm run dev`

## Testing
### Backend
### Frontend
- Para las pruebas End-to-End usamos Playwright, un testing framework que nos proporciona NextJs
`npm init playwright` 
npm run build **En una terminal**
npm run start
npx playwright test **En otra terminal** 