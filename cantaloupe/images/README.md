# Immagini per il IIIF Server

Questa directory deve contenere le immagini che verranno servite dal server Cantaloupe.

## Setup Rapido

Per testare il sistema, inserire in questa directory le seguenti immagini:

- `page-1.jpg`
- `page-2.jpg`
- `page-3.jpg`
- `page-4.jpg`

Queste corrispondono ai riferimenti `facs` nel file `sample.xml`.

## Dove Trovare Immagini di Test

### Opzione 1: Usare Immagini di Pubblico Dominio

Scaricare immagini da:
- **Wikimedia Commons**: https://commons.wikimedia.org
- **Internet Archive**: https://archive.org/details/texts
- **Gallica (BnF)**: https://gallica.bnf.fr

### Opzione 2: Creare Immagini Placeholder

Usare un servizio online per creare placeholder:
```bash
# Con curl e un servizio placeholder
curl -o page-1.jpg "https://via.placeholder.com/2000x3000/cccccc/333333?text=Page+1"
curl -o page-2.jpg "https://via.placeholder.com/2000x3000/cccccc/333333?text=Page+2"
curl -o page-3.jpg "https://via.placeholder.com/2000x3000/cccccc/333333?text=Page+3"
curl -o page-4.jpg "https://via.placeholder.com/2000x3000/cccccc/333333?text=Page+4"
```

### Opzione 3: Convertire PDF in Immagini

Se si ha un PDF:
```bash
# Con ImageMagick
convert -density 300 documento.pdf page-%d.jpg

# Con pdftoppm (da poppler-utils)
pdftoppm -jpeg -r 300 documento.pdf page
```

## Formati Supportati

Cantaloupe supporta:
- JPEG (.jpg, .jpeg)
- PNG (.png)
- TIFF (.tif, .tiff)
- GIF (.gif)
- BMP (.bmp)

## Note sulla Risoluzione

Per una buona esperienza con lo zoom:
- Minimo consigliato: 1500x2000 pixel
- Ottimale: 3000x4000 pixel o superiore
- Per manoscritti antichi: 4000x6000 pixel o più

## Mappatura con il TEI

I nomi dei file in questa directory devono corrispondere agli ID referenziati nel TEI:

```xml
<!-- Nel file TEI -->
<facsimile>
  <surface xml:id="page1">
    <graphic url="page-1.jpg"/>  <!-- Nome del file in questa directory -->
  </surface>
</facsimile>

<!-- Nel testo -->
<pb facs="#page1"/>  <!-- Riferimento all'ID sopra -->
```

## Esempio Completo

1. Scaricare 4 immagini di pagine di manoscritto
2. Rinominarle: `page-1.jpg`, `page-2.jpg`, `page-3.jpg`, `page-4.jpg`
3. Copiarle in questa directory
4. Avviare Cantaloupe
5. Verificare che siano accessibili: `http://localhost:8182/iiif/2/page-1.jpg/info.json`
