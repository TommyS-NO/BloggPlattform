# Prosjektdokumentasjon

## Introduksjon

- Dette prosjektet er en enkel bloggplattform utviklet med Node.js og Express, og bruker SQLite som database.
- Dette er en bloggplattform  hvor brukere kan registrere seg, logge inn, og opprette, hente, oppdatere, og slette blogginnlegg.
- Målet er å knytte min backend oppmot Frontend som er laget av Faglærer. 
  
### For mer informasjon om`Node`, besøk (https://nodejs.org/)

### For detaljer om `express`, besøk (https://expressjs.com/)

### For detaljer om `SQLite3`, besøk (https://www.sqlite.org/docs.html)

## Installasjon

- For å installere og starte prosjektet, følg disse trinnene:

### Trinn 1 npm install

- For å starte servern, bruk kommandoen:

### Trinn 2 node server.js

- Starter Express-servern.
  
## Prosess og utvikling

- I utviklingen av denne bloggplattformen ble det lagt vekt på å skape et brukervennlig, funksjonelt og sikkert system. Her er de viktigste funksjonene og utviklingspunktene:

## Brukerhåndtering

### Registrering og Innlogging#:

- Implementert med `userRoute.js`. Brukere kan registrere seg med et brukernavn, e-post og passord. Passordene hashes ved hjelp av `bcrypt` før de lagres i databasen for å sikre brukerens data.
  
### JWT-basert Autentisering#:

- Ved innlogging genereres en JWT (JSON Web Token) som brukes for autentisering i beskyttede ruter.

## Blogginnlegg

### Opprette Innlegg#:

  - Autentiserte brukere kan opprette blogginnlegg. Hver post knyttes til brukeren som skapte den.

### Lese Innlegg#:

-  Alle besøkende til plattformen kan lese innlegg. Innlegg kan hentes både individuelt ved ID og som en liste over alle tilgjengelige innlegg.

### Oppdatere og Slette Innlegg#:

-  Innleggsforfatteren, identifisert gjennom JWT, kan oppdatere eller slette sine egne innlegg.

## Serverkonfigurasjon

### Express.js#: 

- Brukt som backend-rammeverket for å håndtere HTTP-forespørsler og rute dem til de tilsvarende kontrollerne.

### CORS-konfigurasjon#:

- Tillater at frontend-applikasjonen trygt kan kommunisere med backenden.

## Database

Applikasjonen bruker SQLite-database for å lagre og administrere data. Det er to hovedtabeller:

### Users

- `users`: Lagrer brukerinformasjon. Feltene inkluderer:
  - `id`: Unik identifikator for brukeren.
  - `username`: Brukernavn, unikt for hver bruker.
  - `password`: Hashet passord for sikker lagring.
  - `email`: Brukerens e-postadresse, også unik.
  - `dateCreated`: Dato og tid for når brukerkontoen ble opprettet.

### Posts
- `posts`: Lagrer informasjon om blogginnlegg. Feltene inkluderer:
  - `id`: Unik identifikator for innlegget.
  - `userId`: Referanse til brukeren som opprettet innlegget.
  - `title`: Tittelen på blogginnlegget.
  - `content`: Innholdet i blogginnlegget.
  - `datePosted`: Dato og tid for når innlegget ble postet.

## Postman Testing

For å teste API-endepunkter via Postman, kan du bruke følgende tabell som referanse:

== Merk: For endepunkter som krever autentisering, må en gyldig JWT token inkluderes i `Authorization` headeren av HTTP-forespørselen. ==
== Formatet skal være: `Authorization: Bearer [Token Her]`.== 


| Endepunkt       | Metode | Beskrivelse                      | Krever Autentisering |
|-----------------|--------|----------------------------------|----------------------|
| `/register`     | POST   | Registrerer ny bruker            | Nei                  |
| `/login`        | POST   | Logger inn en bruker             | Nei                  |
| `/posts`        | GET    | Henter alle innlegg              | Nei                  |
| `/posts/:id`    | GET    | Henter et spesifikt innlegg      | Nei                  |
| `/posts`        | POST   | Oppretter et nytt innlegg        | Ja                   |
| `/posts/:id`    | PUT    | Oppdaterer et innlegg            | Ja                   |
| `/posts/:id`    | DELETE | Sletter et innlegg               | Ja                   |


### Eksempel på Testing av Endepunkter i Postman

1. ### Registrer ny bruker (`/register`)
   - Metode: POST
   - URL: `http://localhost:3000/register`
   - Body:
     ```json
     {
       "username": "nybruker",
       "password": "passord123",
       "email": "nybruker@example.com"
     }
     ```

2. ### Logg inn bruker (`/login`)
   - Metode: POST
   - URL: `http://localhost:3000/login`
   - Body:
     ```json
     {
       "username": "nybruker",
       "password": "passord123"
     }
     ```

3. ### Hent alle innlegg (`/posts`)
   - Metode: GET
   - URL: `http://localhost:3000/posts`

4. ### Opprett et nytt innlegg (`/posts`)
   - Metode: POST
   - URL: `http://localhost:3000/posts`
   - Header: `Authorization: Bearer YOUR_TOKEN_HERE`
   - Body:
     ```json
     {
       "title": "Mitt første innlegg",
       "content": "Innhold i det første innlegget"
     }
     
## Faglig refleksjon

### Evaluering av eget arbeid

_Selvrefleksjon om prosjektets styrker og svakheter._

### Veiledning og Justering

_Refleksjon over hvordan arbeidet kunne blitt forbedret med veiledning._
