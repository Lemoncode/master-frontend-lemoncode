// Punto de entrada de la aplicación (Vite).
// Carga las familias tipográficas vía Fontsource y la hoja de estilos ITCSS.

// Geologica — títulos y logo (SemiBold 600, Bold 700)
import '@fontsource/geologica/600.css';
import '@fontsource/geologica/700.css';

// Inter — cuerpo y UI (Regular 400, Medium 500, SemiBold 600)
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';

// Estilos
import './css/index.css';

// Comportamiento del header (menú móvil, scrollspy, sombra al scroll)
import { initNav } from './js/nav.js';

initNav();
