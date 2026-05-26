import PyPDF2

files = [
    r"C:\Users\SSFL-RETAIL-017\Downloads\enable - SEBIDeck_pvt circulation Dec 2025.pdf",
    r"C:\Users\SSFL-RETAIL-017\Downloads\sebi circular dated -8th dec 2025.pdf"
]

with open(r"C:\Users\SSFL-RETAIL-017\sunidhi-nextjs\scripts\pdf-output.txt", "w", encoding="utf-8") as out_f:
    for file_path in files:
        out_f.write(f"\n\n--- EXTRACTED: {file_path} ---\n\n")
        try:
            with open(file_path, "rb") as pdf_f:
                reader = PyPDF2.PdfReader(pdf_f)
                for page in reader.pages:
                    text = page.extract_text()
                    if text:
                        out_f.write(text + "\n")
        except Exception as e:
            out_f.write(f"Error reading file: {e}\n")
