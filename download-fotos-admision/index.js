
require("dotenv").config({path:'../.env'});

const ftp = require("basic-ftp");
const path = require("path");

async function listFiles() {
    const client = new ftp.Client();
    client.ftp.verbose = true; 
    try {
        await client.access({
            host:process.env.FTP_ADMISION_HOST,
            user: process.env.FTP_ADMISION_USER,
            password:process.env.FTP_ADMISION_PASSWORD,  
            secure: false // Cambiar a true si el servidor usa FTPS
        });
        console.log("✅ Conectado al servidor FTP");
        const archivos = await client.list();
        for (const archivo of archivos) {
            if (archivo.isFile) {
                try{
                    const rutaDestino = path.join('fotos', archivo.name);
                    console.log(`Descargando archivo: ${archivo.name}`);
                    await client.downloadTo(rutaDestino, archivo.name);
                }catch(error){
                    console.error("❌ Error al descargar archivo:", error); 
                }
            }
        }
        console.log("Todos los archivos fueron descargados.");
    } catch (error) {
        console.error("❌ Error al conectar:", error);
    } finally {
        client.close(); // Cierra la conexión
    }
}

listFiles();
