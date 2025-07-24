# StreamFlow Music - Plataforma de Streaming Musical

![StreamFlow Logo](https://via.placeholder.com/150x50?text=StreamFlow+Music)

StreamFlow Music es una plataforma moderna de streaming de música desarrollada con React, TypeScript y Vite. Ofrece una experiencia de usuario fluida para descubrir, reproducir y gestionar música en línea.

## 🚀 Características Principales

- **Reproducción de Música**: Reproduce tus canciones favoritas con controles intuitivos.
- **Gestión de Playlists**: Crea y gestiona listas de reproducción personalizadas.
- **Biblioteca Personal**: Organiza tu música en una biblioteca personal.
- **Búsqueda Avanzada**: Encuentra canciones, álbumes y artistas fácilmente.
- **Sistema de Autenticación**: Registro e inicio de sesión de usuarios.
- **Diseño Responsive**: Interfaz adaptada para diferentes dispositivos.
- **Temas Oscuro/Claro**: Personaliza tu experiencia visual.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: 
  - React 18
  - TypeScript
  - Vite (Build Tool)
  - Tailwind CSS (Estilos)
  - Framer Motion (Animaciones)
  - React Router (Navegación)
  - React Hook Form (Formularios)
  - Yup (Validación)
  - React Hot Toast (Notificaciones)

- **Autenticación y Base de Datos**:
  - Supabase (Backend as a Service)

- **Otras Librerías**:
  - date-fns (Manejo de fechas)
  - lucide-react (Iconos)
  - clsx (Manejo de clases condicionales)

## 📁 Estructura del Proyecto

```
streamflow-music/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── auth/           # Componentes de autenticación
│   │   ├── common/         # Componentes comunes
│   │   ├── layout/         # Componentes de diseño
│   │   ├── music/          # Componentes de música
│   │   └── player/         # Componentes del reproductor
│   ├── contexts/           # Contextos de React
│   ├── data/               # Datos estáticos y mocks
│   ├── pages/              # Componentes de página
│   ├── types/              # Definiciones de TypeScript
│   ├── utils/              # Utilidades y helpers
│   ├── App.tsx             # Componente principal
│   └── main.tsx            # Punto de entrada
├── .eslintrc.js            # Configuración de ESLint
├── .gitignore              # Archivos ignorados por Git
├── package.json            # Dependencias y scripts
├── tailwind.config.js      # Configuración de Tailwind CSS
├── tsconfig.json           # Configuración de TypeScript
└── vite.config.ts          # Configuración de Vite
```

## 🚀 Cómo Empezar

### Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- Cuenta en Supabase (para autenticación y base de datos)

### Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/streamflow-music.git
   cd streamflow-music
   ```

2. Instala las dependencias:
   ```bash
   npm install
   # o
   yarn
   ```

3. Configura las variables de entorno:
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```env
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   # o
   yarn dev
   ```

5. Abre tu navegador en:
   ```
   http://localhost:5173
   ```

## 📱 Vistas de la Aplicación

### Página de Inicio
![Página de Inicio](https://via.placeholder.com/800x500?text=StreamFlow+Home+Page)

### Reproductor de Música
![Reproductor](https://via.placeholder.com/800x300?text=Music+Player)

### Página de Búsqueda
![Búsqueda](https://via.placeholder.com/800x500?text=Search+Page)

## 🛠️ Estructura de Componentes

### Componentes Principales

1. **Header**: Barra de navegación superior con búsqueda y perfil de usuario.
2. **Sidebar**: Navegación principal con acceso a las diferentes secciones.
3. **MusicPlayer**: Reproductor de música con controles de reproducción.
4. **AuthForm**: Formulario de autenticación (registro/inicio de sesión).
5. **SongList**: Lista de canciones con opciones de reproducción.
6. **PlaylistCard**: Tarjeta para mostrar información de playlists.

## 🔄 Estados y Contextos

La aplicación utiliza dos contextos principales:

1. **AuthContext**: Maneja el estado de autenticación del usuario.
   - Información del usuario
   - Token de autenticación
   - Funciones de login/logout

2. **PlayerContext**: Controla el estado del reproductor de música.
   - Canción actual
   - Estado de reproducción
   - Cola de reproducción
   - Volumen y progreso

## 🧪 Pruebas

Para ejecutar las pruebas:

```bash
npm test
# o
yarn test
```

## 🛠️ Despliegue

### Construir para Producción

```bash
npm run build
# o
yarn build
```

### Desplegar en Vercel

1. Instala la CLI de Vercel:
   ```bash
   npm install -g vercel
   ```

2. Inicia sesión en Vercel:
   ```bash
   vercel login
   ```

3. Despliega la aplicación:
   ```bash
   vercel --prod
   ```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más información.

## 👥 Contribución

Las contribuciones son bienvenidas. Por favor, lee las [pautas de contribución](CONTRIBUTING.md) antes de enviar un pull request.

## 📧 Contacto

¿Preguntas o comentarios? Envía un correo a contacto@streamflowmusic.com

---

Desarrollado con ❤️ por el equipo de StreamFlow Music
