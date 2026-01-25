# Intercobros

Sistema full-stack para gestión de cobros con autenticación JWT.

## Instalación

### Backend
1. Navega a la carpeta `backend`:
   ```
   cd backend
   ```
2. Instala las dependencias:
   ```
   npm install
   ```
3. Crea un archivo `.env` con:
   ```
   JWT_SECRET=tu_secreto_aqui
   ```
4. Inicia el servidor:
   ```
   npm start
   ```

### Frontend
1. Navega a la carpeta `frontend`:
   ```
   cd frontend
   ```
2. Instala las dependencias:
   ```
   npm install
   ```
3. Inicia la aplicación:
   ```
   npm start
   ```

## Uso
- Accede a `http://localhost:3000/login` para iniciar sesión.
- Usuario de prueba: `admin`, Contraseña: `password`.
- Después del login, serás redirigido al dashboard.

## Tecnologías
- Frontend: React, Bootstrap, Axios, React Router
- Backend: Node.js, Express, JWT, bcrypt