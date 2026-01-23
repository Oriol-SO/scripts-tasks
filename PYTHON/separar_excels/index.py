import pandas as pd

df = pd.read_excel("julioagosto.xlsx",)

chunk_size = 500
for i in range(0, len(df), chunk_size):
    chunk = df.iloc[i:i+chunk_size]
    chunk.to_excel(f"salidas/salida_{i//chunk_size + 1}.xlsx", index=False)
