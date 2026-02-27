# PostCSS - Introducción

## 1. ¿Qué es PostCSS?

> **PostCSS es una herramienta para transformar CSS con JavaScript**

- **No es un preprocesador** como Sass o Less
- Es un **postprocesador** - trabaja con CSS ya existente
- Utiliza **plugins** para transformar el CSS
- Es **modular** - solo usas lo que necesitas, muy customizable

Analogía:

```
Preprocesadores (Sass/Less) → CSS → PostCSS → CSS optimizado
```

<br />

## 2. ¿Para qué sirve PostCSS?

### Casos de uso principales:

1. **Autoprefixing automático**

   - Prefijos de navegadores automáticos
   - Compatibilidad cross-browser

2. **Optimización de CSS**

   - Minificación
   - Eliminación de código no utilizado
   - Optimización de selectores

3. **Características CSS futuras o muy recientes con soporte para versiones de navegadores antiguas**

   - Variables CSS
   - Nesting
   - Color Functions
   - Logical Properties
   - Custom Media Queries
   - Custom Selectors

4. **Linting y formateo**

   - Detección de errores
   - Formateo consistente

<br />

## 3. Arquitectura y diferencias

### 3.1 PostCSS vs Preprocesadores:

| Característica     | Sass/Less            | PostCSS                          |
| ------------------ | -------------------- | -------------------------------- |
| **Sintaxis**       | Propia               | CSS estándar (puede variar)      |
| **Extensibilidad** | Limitada             | Infinita (plugins)               |
| **Performance**    | Compilación completa | Solo transforma lo necesario     |
| **Adopción**       | Todo o nada          | Gradual                          |
| **Futuro**         | Sintaxis propietaria | Estándares CSS (más o menos)     |
| **Dependencias**   | Pocas (1-2 paquetes) | Muchas (múltiples plugins)       |
| **Mantenimiento**  | Más estable          | Riesgo de dependencias obsoletas |

### 3.2 Consideraciones de PostCSS:

**Ventajas:**

- Flexibilidad total con plugins
- Solo usas lo que necesitas
- Basado en estándares CSS

**Desventajas:**

- **Mayor superficie de dependencias**: Cada plugin es un paquete npm separado
- **Complejidad de mantenimiento**: En proyectos grandes, gestionar 10-15 plugins puede ser problemático
- **Riesgo de dependencias obsoletas**: Plugins pueden quedarse sin mantenimiento
- **Compatibilidad entre plugins**: Algunos plugins pueden entrar en conflicto
- **Curva de aprendizaje**: Requiere conocer configuración específica de cada plugin

**Recomendación para proyectos:**

- **Proyectos pequeños/medianos**: PostCSS es excelente
- **Proyectos grandes/empresariales**: Considerar Sass + PostCSS solo para autoprefixing

Esto es muy relativo al contexto del proyecto y equipo.

<br />

## 4. Documentación

- PostCSS: [https://postcss.org/](https://postcss.org/)
- PostCSS GitHub: [https://github.com/postcss/postcss](https://github.com/postcss/postcss)
