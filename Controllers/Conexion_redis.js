//IMPORTAR LIBRERIAS
const redis = require("redis");
const axios = require("axios");
const express = require("express");
const responseTime = require("response-time");

//REQUERIMIENTO DE CONSTANTES 
const {frutas_id,api} = require("../contants.js");

//LEVANTA EL SERVICIO EN EXPRESS Y LEVASNTA EL PUERTO 3000
const app = express();
app.use(responseTime());
app.listen(3000);

const redis_p1 = redis.createClient({url:'redis://127.0.0.1:6379'});
const redis_p2 = redis.createClient({url:'redis://127.0.0.1:6380'});
const redis_p3 = redis.createClient({url:'redis://127.0.0.1:6381'});

redis_p1.connect();
redis_p2.connect();
redis_p3.connect();

//EN ESTA PARTE SE COMPRUEBA QUE EL ITERADOR DEL ID ESTE EN CACHE, DE LO CONTRARIO, SE GUARDA EN CACHE
app.get("/fruit/:id", async (req, res) =>{
    let id = req.params.id;
    let indice_id = frutas_id.indexOf(parseInt(id));//calcula el id con el cual se distribuira en las caches
    console.log(indice_id);

    //EN ESTE CASO ENTRA EN LA PARTICION 1 DE CACHE
    if(indice_id<14){
        try{
            const valor = await redis_p1.get(indice_id.toString());
            if(valor!=null){
                console.log("CACHE 1->Valor obtenido de redis: ", JSON.parse(valor));
                res.send(JSON.parse(valor));
            }else{
                console.log("No se encuentra en la particion 1 ");
                const respuesta = await axios.get(`${api}${id}`);
                const resp_json = JSON.stringify(respuesta.data);
                await redis_p1.set(indice_id.toString(), resp_json); 
                console.log(JSON.parse(resp_json));
                res.send(JSON.parse(resp_json));
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
                res.send(JSON.parse(valor));
            }else{
                console.log("No se encuentra en la particion 2 ");
                const respuesta = await axios.get(`${api}${id}`);
                const resp_json = JSON.stringify(respuesta.data);
                await redis_p2.set(indice_id.toString(), resp_json); 
                console.log(JSON.parse(resp_json));
                res.send(JSON.parse(resp_json));
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
                res.send(JSON.parse(valor));
            }else{
                console.log("No se encuentra en la particion 3 ");
                const respuesta = await axios.get(`${api}${id}`);
                const resp_json = JSON.stringify(respuesta.data);
                await redis_p3.set(indice_id.toString(), resp_json); 
                console.log(JSON.parse(resp_json));
                res.send(JSON.parse(resp_json));
                console.log("Se ha guardado en cache P3...");
            }
        }catch(error){
            console.error("ERROR", error);
        }
    }
});

/*
module.exports={
    is_in_cache,
};*/







