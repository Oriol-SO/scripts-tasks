/**
 * obtiene en un json toda la lista de arcchivs dentro de la carpeta resolucion_cu
 */


require("dotenv").config({ path: "../.env" });

const ftp = require("basic-ftp");
const fs = require("fs");

async function obtenerListaDeArchivos() {
    const client = new ftp.Client();
    client.ftp.verbose = true; // Activa logs detallados en la consola

    try {
        await client.access({
            host: process.env.FTP_GYT_HOST,
            user: process.env.FTP_GYT_USER,
            password: process.env.FTP_GYT_PASSWORD,
            port: 21,
            secure: false, // Cambia a true si usas FTPS
        });

        console.log("✅ Conectado al servidor FTP");

        const carpeta = "resolucion_cu"; // Cambia esto a la carpeta que necesitas
        await client.cd(carpeta);
        console.log(`📂 Cambiado al directorio: ${carpeta}`);

        // Obtener la lista de archivos en la carpeta
        const archivos = await client.list();
        const nombresDeArchivos = archivos.map(file => '/storage/resolucion_cu/'+file.name); // Extrae solo los nombres

        // Guardar la lista en un archivo JSON
        fs.writeFileSync("lista_archivos.json", JSON.stringify(nombresDeArchivos, null, 2));
        console.log("📂 Lista de archivos guardada en 'lista_archivos.json'");

    } catch (error) {
        console.error("❌ Error al conectar o listar archivos:", error);
    } finally {
        client.close(); // Cierra la conexión
    }
}

obtenerListaDeArchivos();
