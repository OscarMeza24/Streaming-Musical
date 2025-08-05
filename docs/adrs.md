# Architectural Decision Records (ADRs)

## Tabla de Contenidos
- [ADR 0001: Elección de Supabase como Backend](#adr-0001-elección-de-supabase-como-backend)
- [ADR 0002: Elección de React + Vite para el Frontend](#adr-0002-elección-de-react--vite-para-el-frontend)
- [ADR 0003: Integración de Stripe para pagos](#adr-0003-integración-de-stripe-para-pagos)

---

## ADR 0001: Elección de Supabase como Backend

**Estado:** Aprobado  
**Fecha:** 2025-07-15  
**Autores:** Equipo de desarrollo

### Contexto
Necesitábamos una solución backend rápida de implementar, con autenticación integrada y base de datos escalable, para reducir la complejidad del proyecto.

### Decisión
Se eligió **Supabase** como backend por las siguientes razones:
- Ofrece una base de datos PostgreSQL completamente gestionada.
- Tiene autenticación integrada con soporte para JWT y OAuth.
- API RESTful y en tiempo real automáticamente generada.
- Panel de administración intuitivo.
- Documentación clara.

### Consecuencias
- Se redujo significativamente el tiempo de desarrollo backend.
- Dependemos de un servicio externo (vendor lock-in).
- Se deben manejar correctamente las políticas de seguridad y control de acceso desde Supabase.

---

## ADR 0002: Elección de React + Vite para el Frontend

**Estado:** Aprobado  
**Fecha:** 2025-07-15  
**Autores:** Equipo de desarrollo

### Contexto
Se requería un framework moderno, de alta velocidad de desarrollo, soporte comunitario fuerte y facilidad para integrar librerías.

### Decisión
Se optó por **React** con **Vite** como bundler por los siguientes motivos:
- React es ampliamente conocido por el equipo.
- Vite proporciona una experiencia de desarrollo más rápida y moderna que Create React App.
- Vite permite una configuración mínima y tiempos de recarga en caliente muy bajos.

### Consecuencias
- Mayor productividad y agilidad en el desarrollo frontend.
- Necesidad de configurar Tailwind CSS y otras librerías manualmente (aunque con buena documentación).

---

## ADR 0003: Integración de Stripe para pagos

**Estado:** Aprobado  
**Fecha:** 2025-07-15  
**Autores:** Equipo de desarrollo

### Contexto
El proyecto requería un sistema de pagos seguro, confiable y con buena documentación para integrar con facilidad.

### Decisión
Se eligió **Stripe** por:
- Amplio soporte y documentación para integración web.
- Buenas prácticas de seguridad en la gestión de pagos.
- API bien diseñada y mantenida.
- Módulos oficiales para React y Node.js.

### Consecuencias
- Reducción del riesgo en la implementación de pagos.
- Costos por transacción (comisión de Stripe).
- Requiere manejar claves secretas de forma segura.
