import fitz  # pip install PyMuPDF

input_pdf = "reqs.pdf"
output_pdf = "mitad_superior.pdf"

doc = fitz.open(input_pdf)
new_doc = fitz.open()  # PDF nuevo

for page in doc:
    width = page.rect.width
    height = page.rect.height

    # Rectángulo que define la mitad superior
    top_rect = fitz.Rect(0, 0, width, height / 2)

    # Crear página nueva del tamaño de la mitad superior
    new_page = new_doc.new_page(width=width, height=height/2)
    # Renderizar la mitad superior en la nueva página
    new_page.show_pdf_page(new_page.rect, doc, page.number, clip=top_rect)

# Guardar PDF final
new_doc.save(output_pdf)
print("PDF generado:", output_pdf)
