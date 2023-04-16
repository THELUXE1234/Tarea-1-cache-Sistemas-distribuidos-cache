const fs = require("fs");


function Get_Datos(data){
    const texto = data.join(" ");
    fs.writeFile("./Datos/datos.txt",texto, (error)=>{
        if(error) throw error;
        console.log("Los datos se han guardado correctamente en datos.txt")
    });
}
module.exports = {
    Get_Datos,
};