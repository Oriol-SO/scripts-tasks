const xlsx = require("xlsx");
const fs = require("fs");

function excelDateToJSDate(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return date_info.toISOString().split("T")[0]; // yyyy-mm-dd
}

const filePath = "insumos.xlsx";
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

if (!sheet) {
  console.log(`❌ La hoja "${sheetName}" no existe.`);
  process.exit(1);
}

// 📊 Leer datos
const jsonDataRaw = xlsx.utils.sheet_to_json(sheet, { defval: "" });

const jsonData = jsonDataRaw.map((row) => {
  const newRow = {};

  Object.entries(row).forEach(([key, value]) => {
    const cleanKey = key.trim().toUpperCase(); // Normalizamos

    if (
      (cleanKey === "FECHA" || cleanKey === "FECHA DE FACTURA") &&
      typeof value === "number" &&
      value > 40000 &&
      value < 60000
    ) {
      newRow[key] = excelDateToJSDate(value);
    } else {
      newRow[key] = value;
    }
  });

  return newRow;
});

const jsonFilePath = "output.json";
fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));

console.log(`✅ Convertido exitosamente con fechas limpias en "${jsonFilePath}" 💪`);
