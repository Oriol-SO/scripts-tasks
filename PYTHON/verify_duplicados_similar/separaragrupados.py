import os
import pandas as pd

# Leer el archivo JSON generado previamente
df_groups = pd.read_json("output/similar-names-cleaned.json", encoding="utf-8")

# Filtrar filas que tienen 2 o más valores no nulos
filtered_df = df_groups.dropna(axis=1, how='all')  # eliminar columnas completamente vacías
filtered_df = filtered_df[df_groups.notna().sum(axis=1) >= 2]  # solo filas con 2 o más valores no nulos

# Crear carpeta si no existe
os.makedirs("output", exist_ok=True)

# Guardar resultado como nuevo JSON
filtered_df.to_json("output/similar-names-2-or-more.json", orient="records", force_ascii=False, indent=2)
