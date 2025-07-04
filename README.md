# Trabajo de fin de Grado - Analisis, diseño y implementación de una aplicación web para la gestión de eventos deportivos
## Preparación para la ejecución de la aplicación
### Backend
- Se debe crear un entorno virtual dentro de `backend/` para poder alamacenar en él las dependencias del proyecto (para no ternerlas de manera local). Una vez creado se activa y se instalan en el las librerias necesarias (que se encuentran en requirements.txt). Los comandos a utilizar son los siguientes:  
```bash
python -m venv venv  
source venv/bin/activate  //(MAC o LINUX)  
venv/Scripts/activate     //(WINDOWS)  
```
- Una vez hecho esto dentro del directorio `backend/` arrancamos el servidor: `uvicorn main:app --reload`  
### Frontend
- Nos situamos en `frontend/event-register/` y ejecutamos los siguientes comandos:  

```bash
npm install                      //Necesario para instalar las librerias basicas de NextJS**  
npm install @radix-ui/themes     //Libreria de react usada para el diseño de la ui**   
npm install @radix-ui/react-icons  
npm install @radix-ui/react-avatar   
npm install @radix-ui/react-checkbox  
npm install @radix-ui/react-dialog  
npm install tailwindcss-animate  
npm install radix-themes-tw postcss-import --dev` //Para que funcione la configuracion del Tailwind**   
npx shadcn@latest add table`                     //Uso de shadcn para la creacion de las tablas**  
npm install @tanstack/react-table   
npm install -D @playwright/test  //Añadimos el framework Playwright
npm install react-router-doms //Mirar si lo uso

```
- Para ejecutar el frontend usamos el siguiente comando:  
`npm run dev`

## Testing
### Backend
```bash
pytest  //Para ejecutar los test
pytest --cov=../backend/ //para ver la cobertura
```
### Frontend
- Para las pruebas End-to-End usamos Playwright, un testing framework que nos proporciona NextJs
```bash
npx playwright install
npm init playwright   
npm run build //En una terminal    
npm run dev    
npx playwright test --debug //En otra terminal     
```
