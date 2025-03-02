# Configuración del BACKEND 
- Instalar python en el PC (https://www.python.org/downloads/)
- INSTALACIÓN DEL ENTORNO VIRTUAL (DONDE SE ALMACENARÁN LAS DEPENDENCIAS ASOCIADAS A ESTE PROYECTO, PARA ASI NO ALMACENARLAS LOCALMENTE). Esto hacerlo fuera del backend y frontend  
- CREAR Y ACTIVAR EL ENTORNO
 `python -m venv venv`  
`source venv/bin/activate` (MAC o LINUX)    
`source venv/Scripts/activate` (WINDOWS)  
- Descargamos las siguientes librerias (dentro de venv)  
`pip install fastapi uvicorn pydantic` (-r si es un txt)  
`pip install sqlalchemy`  
`pip install pyjwt`  
`pip install httpx` (para usar TestClient)  
`pip install pytest` (para ejecutar los test)  
instalar bcrypt==4.0.1 ---> https://github.com/pyca/bcrypt/issues/684    

`pip install --upgrade pip` (actualizar el pip si es necesario)   

- ARRANCAR EL SERVIDOR
`uvicorn main:app --reload`  siendo main el nombre del archivo y app el de la aplicacion
# Configuración del FRONTEND 
- instalar NodeJs en el PC (https://nodejs.org/en/download)
`npx create-next-app@latest`  
`cd event-register`  
`npm install` (por si el run dev o el start falla)  
`npm run dev`  
`npm install cors`  
`npm install express`  
`npm install fs` (por si da error de que no detecta fs)  
`npm install js-cookie` (esto para la gestion de sesiones)  
`npm install iron-session` (esto es para utilizar encrypt)  

`npm i --save-dev @types/js-cookie` (esti funciono)   
- PARA GIT BASH PONER :   
`echo 'export PATH=$PATH:/c/Program\ Files/nodejs' >> ~/.bashrc`  
`source ~/.bashrc`  

- Para el tema de los tockens del backend  
`openssl rand -hex 32`  

Para el tema del diseño de los eventos : https://nextjs.org/learn/dashboard-app/ (Capitulo 2)  
https://juannunezblasco.es/autenticacion-nextjs/ (Blog que consulte)  

- INstalar para radix-ui : 
npm install @radix-ui/react-icons  


