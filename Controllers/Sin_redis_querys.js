//IMPORTAR LIBRERIAS
const axios = require("axios");
const {Get_Datos} = require("./Get_datos.js");

//CONSTANTES
const {frutas_id, api} = require("../contants.js");// arreglo de id de frutas
const datos = [];

async function Consulta(indice){
  try{
    const tiempoInicio = performance.now();
    const respuesta = await axios.get(`${api}${indice}`);
    const resp_json = JSON.stringify(respuesta.data);
    console.log(JSON.parse(resp_json));
    console.log("\n");
    const tiempoTermino = performance.now();
    const duracion = tiempoTermino-tiempoInicio;
    return duracion;
  }catch(error){
    console.log(error);
    //errores++;
    return;
  }

}

async function main(){
  const promesas = [];
  for (let i=0; i<100;i++){
    const random_query = Math.floor(Math.random()*40);
    const id = frutas_id[random_query];
    promesas.push(Consulta(id));
  } 
  const resultados = await Promise.all(promesas);
  let total = resultados.reduce((a, b) => a + b, 0);
  console.log(`El total es:${total}`);
  Get_Datos(resultados);
} 

main();