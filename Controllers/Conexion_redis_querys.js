//IMPORTAR LIBRERIAS
const redis = require("redis");
const axios = require("axios");
const {Get_Datos} = require("./Get_datos.js");

//CONSTANTES
const {frutas_id, api} = require("../contants.js");// arreglo de id de frutas
const datos = [];

const redis_p1 = redis.createClient({url:'redis://127.0.0.1:6379'});
const redis_p2 = redis.createClient({url:'redis://127.0.0.1:6380'});
const redis_p3 = redis.createClient({url:'redis://127.0.0.1:6381'});

redis_p1.connect();
redis_p2.connect();
redis_p3.connect();

async function Consulta(indice){
    let indice_id = frutas_id.indexOf(parseInt(indice));//calcula el id con el cual se distribuira en las caches
    if(indice_id<14){
        try{
            const valor = await redis_p1.get(indice_id.toString());
            if(valor!=null){
                console.log("CACHE 1->Valor obtenido de redis: ", JSON.parse(valor));
            }else{
                console.log("No se encuentra en la particion 1 ");
                const respuesta = await axios.get(`${api}${indice}`);
                const resp_json = JSON.stringify(respuesta.data);
                await redis_p1.set(indice_id.toString(), resp_json,{EX:60}); 
                console.log(JSON.parse(resp_json));
                console.log("Se ha guardado en cache P1...");
            }
        }catch(error){
            console.error("ERROR", error);
        }
      

    //EN ESTE CASO ENTRA EN LA PARTICION 2
    }else if(indice_id>=14 && indice_id<27){
        try{
            const valor = await redis_p2.get(indice_id.toString());
            if(valor!=null){
                console.log("CACHE 2->Valor obtenido de redis: ", JSON.parse(valor));
            }else{
                console.log("No se encuentra en la particion 2 ");
                const respuesta = await axios.get(`${api}${indice}`);
                const resp_json = JSON.stringify(respuesta.data);
                await redis_p2.set(indice_id.toString(), resp_json,{EX:60}); 
                console.log(JSON.parse(resp_json));
                console.log("Se ha guardado en cache P2...");
            }
        }catch(error){
            console.error("ERROR", error);
        }


    //EN ESTE CASO ENTRA A LA PARTICION 3 DE CACHE
    }else{
        try{    
            // Se conecta a la particion 3 de cache
            const valor = await redis_p3.get(indice_id.toString());
            if(valor!=null){
                console.log("CACHE 3-> Valor obtenido de redis: ", JSON.parse(valor));
            }else{
                console.log("No se encuentra en la particion 3 ");
                const respuesta = await axios.get(`${api}${indice}`);
                const resp_json = JSON.stringify(respuesta.data);
                await redis_p3.set(indice_id.toString(), resp_json,{EX:60}); 
                console.log(JSON.parse(resp_json));
                console.log("Se ha guardado en cache P3...");
            }
        }catch(error){
            console.error("ERROR", error);
        }
    }
  
}


async function main(){

    const promesas = [];
    for (let i=0; i<1000;i++){
        console.log(i);
        const random_query = Math.floor(Math.random()*40);
        const id = frutas_id[random_query];
        const tiempoInicio = performance.now();
        await Consulta(id);
        const tiempoTermino = performance.now();
        console.log("-------------------------------------");
        const tiempoTotal = tiempoTermino - tiempoInicio;
        promesas.push(tiempoTotal);
    } 
    const resultados = await Promise.all(promesas);
    let total = resultados.reduce((a, b) => a + b, 0);
    console.log(`El total es:${total}`);
    Get_Datos(resultados);
} 
main();
