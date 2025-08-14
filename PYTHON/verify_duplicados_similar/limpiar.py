import os
import pandas as pd

# Leer el JSON original con grupos
df = pd.read_json("output/similar-names-2-or-more.json", encoding="utf-8")

# Eliminar columnas completamente vacías (opcionales si hay muchas nulas en una sola columna)
df = df.dropna(axis=1, how='all')

# Convertir cada fila en una lista con solo los valores no nulos
cleaned_groups = df.apply(lambda row: [value for value in row if pd.notna(value)], axis=1)

# Guardar como nuevo JSON sin nulls
os.makedirs("output", exist_ok=True)
cleaned_groups.to_json("output/similar-names-no-null.json", orient="records", force_ascii=False, indent=2)
