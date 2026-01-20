# Cantaloupe IIIF Image Server

Questa directory contiene la configurazione per il server IIIF Cantaloupe utilizzato dal TEI-IIIF Viewer.

## Prerequisiti

- Java 11 o superiore
- Immagini da servire (JPG, PNG, TIFF, ecc.)

## Setup

### 1. Scaricare Cantaloupe

Scaricare l'ultima versione di Cantaloupe dal sito ufficiale:

```bash
cd cantaloupe
curl -OL https://github.com/cantaloupe-project/cantaloupe/releases/download/v5.0.6/cantaloupe-5.0.6.zip
unzip cantaloupe-5.0.6.zip
```

In alternativa, visitare: https://cantaloupe-project.github.io/

### 2. Preparare le Immagini

Copiare le immagini nella directory `images/`:

```bash
# Esempio: copiare immagini di esempio
cp /percorso/alle/tue/immagini/*.jpg ./images/
```

Le immagini devono essere nominate in modo che corrispondano ai riferimenti `facs` nel file TEI:
- `page-1.jpg` corrisponde a `facs="#page1"` (se configurato nella sezione `<facsimile>`)
- Oppure usare il nome file direttamente nel TEI: `facs="page-1.jpg"`

### 3. Avviare il Server

```bash
java -Dcantaloupe.config=./cantaloupe.properties -Xmx2g -jar cantaloupe-5.0.6/cantaloupe-5.0.6.jar
```

Il server sarà disponibile su: `http://localhost:8182`

### 4. Verificare il Funzionamento

Testare l'accesso a un'immagine:

```bash
# Info.json di un'immagine
curl http://localhost:8182/iiif/2/page-1.jpg/info.json

# Immagine completa ridimensionata
curl http://localhost:8182/iiif/2/page-1.jpg/full/500,/0/default.jpg -o test.jpg
```

Se funziona, dovreste ricevere un JSON con le informazioni dell'immagine.

## Struttura Directory

```
cantaloupe/
├── cantaloupe.properties     # Configurazione del server
├── images/                   # Directory per le immagini sorgente
│   ├── page-1.jpg
│   ├── page-2.jpg
│   └── ...
├── cache/                    # Cache delle immagini derivate (creata automaticamente)
├── cantaloupe-5.0.6/        # JAR e file di Cantaloupe (dopo il download)
└── README.md                 # Questo file
```

## Configurazione

Il file `cantaloupe.properties` è già configurato per:

- IIIF Image API 2.0
- FilesystemSource che legge da `./images/`
- Cache delle immagini derivate in `./cache/`
- Porta HTTP: 8182
- Processore: Java2dProcessor (compatibile con la maggior parte dei formati)

### Modificare la Directory delle Immagini

Per usare una directory diversa, modificare in `cantaloupe.properties`:

```properties
FilesystemSource.BasicLookupStrategy.path_prefix = /percorso/assoluto/alle/immagini/
```

### Modificare la Porta

Per usare una porta diversa, modificare:

```properties
http.port = 8182
```

E aggiornare anche `frontend/src/services/iiifService.js`:

```javascript
const IIIF_CONFIG = {
  baseUrl: 'http://localhost:NUOVA_PORTA/iiif/2',
  version: '2.0'
};
```

## Formato delle Immagini

Cantaloupe supporta molti formati:

- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)
- **TIFF** (.tif, .tiff)
- **GIF** (.gif)
- **BMP** (.bmp)
- **PDF** (.pdf) - solo prima pagina

Per prestazioni ottimali con immagini molto grandi (>10MP), considerare:
- Usare TIFF con tile piramidali
- Usare JPEG2000
- Configurare un processore nativo (KakaduNativeProcessor)

## Troubleshooting

### Il server non si avvia

Verificare che:
1. Java sia installato: `java -version`
2. La porta 8182 non sia già in uso
3. Il percorso in `FilesystemSource.BasicLookupStrategy.path_prefix` esista

### Le immagini non vengono trovate

Verificare che:
1. Le immagini siano nella directory `./images/`
2. I nomi dei file corrispondano agli ID nel TEI
3. Il percorso in `cantaloupe.properties` sia corretto (può essere relativo o assoluto)

### Errori CORS

Se si accede al viewer da un dominio diverso, potrebbe essere necessario configurare CORS.
Cantaloupe gestisce automaticamente CORS, ma verificare che `http.host` sia configurato correttamente.

## Immagini di Esempio

Per testare rapidamente il sistema, è possibile usare immagini di pubblico dominio:

- Wikimedia Commons: https://commons.wikimedia.org
- Internet Archive: https://archive.org
- Gallica (BnF): https://gallica.bnf.fr

Assicurarsi di rispettare le licenze e i termini d'uso.

## Link Utili

- Documentazione Cantaloupe: https://cantaloupe-project.github.io/manual/
- IIIF Image API: https://iiif.io/api/image/
- IIIF Community: https://iiif.io/community/

## Produzione

Per uso in produzione, considerare:

1. **HTTPS**: Abilitare HTTPS in `cantaloupe.properties`
2. **Performance**: Usare processori nativi per formati specifici
3. **Caching**: Configurare una cache distribuita (Redis, Memcached)
4. **Monitoring**: Abilitare i log e monitorare le prestazioni
5. **Security**: Cambiare username/password dell'API admin
