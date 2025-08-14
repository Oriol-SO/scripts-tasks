import json

# Cargar el JSON con los grupos
with open("output/similar-names-no-null.json", "r", encoding="utf-8") as f:
    grupos = json.load(f)

# Generar las sentencias SQL
sentencias_sql = []

for grupo in grupos:
    if len(grupo) < 2:
        continue  # ignorar grupos de 1 solo elemento
    
    valor_correcto = grupo[0].replace("'", "''")  # escapar comillas simples
    valores_a_reemplazar = "', '".join(name.replace("'", "''") for name in grupo[1:])
    
    sentencia = f"UPDATE regs SET PROVEEDOR = '{valor_correcto}' WHERE PROVEEDOR IN ('{valores_a_reemplazar}');"
    sentencias_sql.append(sentencia)

# Guardar en archivo .sql
with open("output/update_proveedores.sql", "w", encoding="utf-8") as f:
    for linea in sentencias_sql:
        f.write(linea + "\n")
