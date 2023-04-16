//IMPORTAR LIBRERIAS
const axios = require("axios");
const save_datos = require("./Get_datos.js");
const express = require("express");
const responseTime = require("response-time");

//CONSTANTES
const {frutas_id, api} = require("../contants.js");// arreglo de id de frutas

//LEVANTAR SERVICIO EN EXPREESS ABRIENDO EL PUERTO 3000
const app = express();
app.use(responseTime());
app.listen(3000);

//Consulta a la api sin cache
app.get("/fruit/:id",async(req,res)=>{
  try{
    let id = req.params.id;
    const respuesta = await axios.get(`${api}${id}`);
    const resp_json = JSON.stringify(respuesta.data);
    console.log(JSON.parse(resp_json));
    res.send(JSON.parse(resp_json));
  }catch(error){
    console.log(error);
  }

});
