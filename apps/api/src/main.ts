// Provisional: solo comprueba que la API puede importar el paquete de dominio.
// En SCRUM-17 este archivo se reemplaza por el arranque de NestJS.
import { sumar } from '@scv/dominio';

console.log(`api: 2 + 3 = ${sumar(2, 3)}`);
