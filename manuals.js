// manuals.js
// Aquí defines TODOS tus manuales.
// Cuando subas un PDF, ponlo dentro de /pdfs y ajusta la ruta en "file".

const MANUALES = [
  {
    id: 1,
    titulo: "Manual de servicio 12,000 BTU Inverter",
    marca: "Midea",
    modelo: "MS12IV-2022",
    categoria: "Servicio",   // Servicio, Instalación, Usuario, Esquema, etc.
    anio: 2022,
    file: "pdfs/midea-12000-inverter-servicio-2022.pdf",
    palabrasClave: "compresor error E1 sensor NTC mini split"
  },
  {
    id: 2,
    titulo: "Guía de instalación 18,000 BTU",
    marca: "AirMax",
    modelo: "AM18-INV",
    categoria: "Instalación",
    anio: 2021,
    file: "pdfs/airmax-18000-instalacion-2021.pdf",
    palabrasClave: "tubería vacío torque instalación pared"
  },
  {
    id: 3,
    titulo: "Manual de usuario 24,000 BTU",
    marca: "Gree",
    modelo: "G24000-STD",
    categoria: "Usuario",
    anio: 2020,
    file: "pdfs/gree-24000-usuario-2020.pdf",
    palabrasClave: "control remoto modos ventilador limpieza filtro"
  }
  // ---- AÑADE AQUÍ EL RESTO DE TUS MANUALES (hasta los 172) ----
];
