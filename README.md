# Prosjektdokumentasjon



## Introduksjon

Dette prosjektet er en enkel bloggplattform utviklet med Node.js og Express, og bruker SQLite som database. Målet er å knytte min backend oppmot Frontend som er laget av Faglærer, dette er en plattform hvor brukere kan registrere seg, logge inn, og opprette, hente, oppdatere, og slette blogginnlegg.
---
For mer informasjon om`Node`, besøk (https://nodejs.org/)

For detaljer om `express`, besøk (https://expressjs.com/)

 For detaljer om `SQLite3`, besøk (https://www.sqlite.org/docs.html)


## Installasjon

## Installasjon

For å installere og starte prosjektet, følg disse trinnene:

### Installere avhengigheter

Først må du installere nødvendige avhengigheter. Åpne en terminal i prosjektets rotmappe og kjør:

# npm install

For å starte servern, bruk kommandoen:

# node server.js

Starter Express-servern.


## Prosess og utvikling

I utviklingen av denne bloggplattformen ble det lagt vekt på å skape et brukervennlig, funksjonelt og sikkert system. Her er de viktigste funksjonene og utviklingspunktene:

### Brukerhåndtering
- **Registrering og Innlogging**: Implementert med `userRoute.js`. Brukere kan registrere seg med et brukernavn, e-post og passord. Passordene hashes ved hjelp av `bcrypt` før de lagres i databasen for å sikre brukerens data.
- **JWT-basert Autentisering**: Ved innlogging genereres en JWT (JSON Web Token) som brukes for autentisering i beskyttede ruter.

### Blogginnlegg
- **Opprette Innlegg**: Autentiserte brukere kan opprette blogginnlegg. Hver post knyttes til brukeren som skapte den.
- **Lese Innlegg**: Alle besøkende til plattformen kan lese innlegg. Innlegg kan hentes både individuelt ved ID og som en liste over alle tilgjengelige innlegg.
- **Oppdatere og Slette Innlegg**: Innleggsforfatteren, identifisert gjennom JWT, kan oppdatere eller slette sine egne innlegg.

### Database
- Bruk av **SQLite**: En lettvekts database som håndterer lagring av brukerinformasjon og blogginnlegg.
- **Skjemaer for `Users` og `Posts`**: To hovedtabeller for å lagre henholdsvis brukerdata og innlegg.

### Serverkonfigurasjon
- **Express.js**: Brukt som backend-rammeverket for å håndtere HTTP-forespørsler og rute dem til de tilsvarende kontrollerne.
- **CORS-konfigurasjon**: Tillater at frontend-applikasjonen trygt kan kommunisere med backenden.

Denne prosessen involverte nøye planlegging og implementering av sikkerhetspraksis, samt testing for å sikre at applikasjonen fungerer som forventet.

## Database

Applikasjonen bruker SQLite-database for å lagre og administrere data. Det er to hovedtabeller:

- `Users`: Lagrer brukerinformasjon. Feltene inkluderer:
  - `id`: Unik identifikator for brukeren.
  - `username`: Brukernavn, unikt for hver bruker.
  - `password`: Hashet passord for sikker lagring.
  - `email`: Brukerens e-postadresse, også unik.
  - `dateCreated`: Dato og tid for når brukerkontoen ble opprettet.

- `Posts`: Lagrer informasjon om blogginnlegg. Feltene inkluderer:
  - `id`: Unik identifikator for innlegget.
  - `userId`: Referanse til brukeren som opprettet innlegget.
  - `title`: Tittelen på blogginnlegget.
  - `content`: Innholdet i blogginnlegget.
  - `datePosted`: Dato og tid for når innlegget ble postet.


## Faglig refleksjon

### Evaluering av eget arbeid

_Selvrefleksjon om prosjektets styrker og svakheter._

### Veiledning og Justering

_Refleksjon over hvordan arbeidet kunne blitt forbedret med veiledning._
