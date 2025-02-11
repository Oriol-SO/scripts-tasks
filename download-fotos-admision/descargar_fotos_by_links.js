require("dotenv").config({path:'../.env'});

const ftp = require("basic-ftp");
const fs = require('fs');
const path = require('path');

const fileLinks= fs.readFileSync('no_existen.json','utf8');
const links=JSON.parse(fileLinks);



async function connect() {
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
       // const archivos = await client.list();
        for (const foto of links) {
            const fileName =foto.split('/').pop();
            const localPath = path.join('nuevas_fotos', fileName);
            console.log(`Descargando: ${localPath}`);
            await client.downloadTo(localPath, fileName);
        }
        console.log("Todos los archivos fueron descargados.");
    } catch (error) {
        console.error("❌ Error al conectar:", error);
    } finally {
        client.close(); // Cierra la conexión
    }
}

connect();