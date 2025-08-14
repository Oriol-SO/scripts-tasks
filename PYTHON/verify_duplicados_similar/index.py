import pandas as pd
from fuzzywuzzy import fuzz, process

# Cargar el archivo JSON (una lista de objetos con clave "COLUMNA")
df1 = pd.read_json("proveedoresjson.json", encoding="utf-8")

# Inicializar conjuntos y lista de grupos
processed = set()
groups = []

# Normalizar nombres para que no afecten mayúsculas, tildes, espacios extras
df1['COLUMNA_NORMALIZADA'] = df1['COLUMNA'].str.upper().str.strip()

# Iterar sobre cada nombre
for name in df1['COLUMNA_NORMALIZADA']:
    if name in processed:
        continue

    matches = process.extract(name, df1['COLUMNA_NORMALIZADA'], limit=10, scorer=fuzz.token_sort_ratio)
    matches = [match[0] for match in matches if match[0] != name and match[1] >= 80]

    group = [name] + matches
    group_set = set(group)

    if not any(group_set <= set(g) for g in groups):  # evitar duplicados
        groups.append(group)
        processed.update(group)

# Guardar los grupos como archivo JSON
df_groups = pd.DataFrame(groups)
df_groups.to_json('output/similar-names-cleaned.json', orient='records', force_ascii=False, indent=2)
