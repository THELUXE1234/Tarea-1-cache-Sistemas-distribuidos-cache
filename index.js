const axios = require("axios");
const save_datos = require("./Controllers/Get_datos.js");
const express = require("express");
const responseTime = require("response-time");

const app = express();
app.use(responseTime())
app.listen(3000);

//CONSTANTES
const {frutas_id, api} = require("./contants.js");// arreglo de id de frutas
const datos = [];

//VARIABLES
// // 
// let errores = 0;//Cantidad de errores de peticiones
// let solicitud_pendiente = 0;// cantidad de solicitudes pendientes
// let umbral_superado = false;

async function peticion(){
  //solicitud_pendiente++;
  try {
    //const tiempoInicio = performance.now();
    const random_query = Math.floor(Math.random()*5);
    console.log("Solicitud iterador: ",random_query);

    //AQUI LE PASARA EL iterador DE LA FRUTAS Y PREGUNTARA SI ESTA EN CACHE
    //SI NO ESTA EN CACHE LO GUARDA Y SI ESTA IMPRIME EL VALOR
    const respuesta = await axios.get(`${api}${frutas_id[random_query]}`);
    console.log(respuesta.data);

    //const tiempoTermino = performance.now();
    //solicitud_pendiente--;
    //const duracion = tiempoTermino-tiempoInicio;
    //datos.push(duracion);

    // if(duracion>umbral_demora){
    //   console.log("La consulta sobrepaso el umbral con :",duracion);
    //   umbral_superado = true;
    //   clearInterval(peticiones);
    //   return;
    // }

    //Impresion de el tiempo de duracion de la consulta
    //console.log(`La solicitud tardó ${duracion} ms`);
    
  } catch (error) {
    // solicitud_pendiente--;
    // errores++;
    console.log(error);
  }
};





/*
let contador_peticiones = 0;
setInterval(()=>{

    //Esto comprueba si hay menos de 10 solicitudes y el umbral no es superado, se envia otra peticion
    if(solicitud_pendiente<10 && !umbral_superado){
      peticion();
      contador_peticiones++;
    }
    if(contador_peticiones === 10){
        clearInterval(peticiones);
        setTimeout(() => {
            save_datos.Get_Datos(datos);// Invoca una funcion que guarda en txt tiempos de cada consulta
            //console.log(`La cantidad de paquetes perdidos fueron: ${errores}`);
            //console.log(`Cantidad de frutas: ${frutas_id.length}`);
        }, 5000);   
    } 
    //console.log(`Solicitudes pendientes: ${solicitud_pendiente}`);
    console.log("---------------------- \n");
},intervalo); //crea peticiones cada cierto intervalo de tiempo*/