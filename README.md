# Prosjektdokumentasjon

## Innholdsfortegnelse

- [Introduksjon](#introduksjon)
- [Installasjon](#installasjon)
- [Prosess og Utvikling](#prosess-og-utvikling)
- [Brukerhåndtering](#brukerhåndtering)
- [Blogginnlegg](#blogginnlegg)
- [Serverkonfigurasjon](#serverkonfigurasjon)
- [Database](#database)
- [Postman Testing](#postman-testing)
- [Feilsøking](#feilsøking)
- [App Arkitektur](#app-arkitektur)

## Introduksjon

Dette prosjektet er en enkel bloggplattform utviklet med Node.js og Express, og bruker SQLite som database.
Det er en bloggplattform hvor brukere kan registrere seg, logge inn, og opprette, hente, oppdatere, og slette blogginnlegg.
Målet er å knytte backend opp mot Frontend.

### For mer informasjon om `Node`, besøk [Node.js](https://nodejs.org/)

### For detaljer om `Express`, besøk [Express.js](https://expressjs.com/)

### For detaljer om `SQLite3`, besøk [SQLite3](https://www.sqlite.org/docs.html)

## Installasjon

For å installere og starte prosjektet, følg disse trinnene:

### Trinn 1: `npm install`

Kjør denne kommandoen for å installere nødvendige avhengigheter.

### Trinn 2: `npm start`
 - node server.js 

Starter Express-serveren.

## Prosess og Utvikling

Utviklingen av denne bloggplattformen har fokusert på å skape et brukervennlig, funksjonelt og sikkert system. Her er de viktigste funksjonene og utviklingspunktene:

## Brukerhåndtering

### Registrering og Innlogging

Implementert med `userRoute.js`. Brukere kan registrere seg med et brukernavn, e-post og passord. Passordene hashes ved hjelp av `bcrypt` før de lagres i databasen for å sikre brukerens data.

### JWT-basert Autentisering

Ved innlogging genereres en JWT (JSON Web Token) som brukes for autentisering i beskyttede ruter.

## Blogginnlegg

### Opprette Innlegg

Autentiserte brukere kan opprette blogginnlegg. Hver post knyttes til brukeren som skapte den.

### Lese Innlegg

Alle besøkende til plattformen kan lese innlegg. Innlegg kan hentes både individuelt ved ID og som en liste over alle tilgjengelige innlegg.

### Oppdatere og Slette Innlegg

Innleggsforfatteren, identifisert gjennom JWT, kan oppdatere eller slette sine egne innlegg.

## Serverkonfigurasjon

### Express.js

Brukt som backend-rammeverket for å håndtere HTTP-forespørsler og rute dem til de tilsvarende kontrollerne.

### CORS-konfigurasjon

Tillater at frontend-applikasjonen trygt kan kommunisere med backenden. Konfigurert til å bruke `localhost:5500` som vert.

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

For å teste API-endepunkter via Postman, kan du bruke følgende tabell som referanse. For endepunkter som krever autentisering, må en gyldig JWT-token inkluderes i `Authorization`-headeren av HTTP-forespørselen. Formatet skal være: `Authorization: Bearer [Din token]`.

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
     

## Feilsøking

### Problem ved opprettelse av innlegg etter innlogging

-- Feilen: Brukere kan ikke opprette blogginnlegg etter innlogging. Det ser ut til at forespørsler om å opprette innlegg ikke blir behandlet som forventet.
    - Dette tyder på at problemet kan være relatert til nettleserens håndtering av cookies og cache.

--** Løsning **-- : Åpne i et privat/inkognitovindu på `localhost:5500`.

-- Mulige årsaker:
- Cookies og Sesjonsstyring: Problemer med hvordan cookies håndteres mellom faner eller vinduer.
- Exstensions: Mulige problemer med installerte utvidelser i nettleser.
- Frontend Logikk: Sjekke hvordan frontend håndterer autentiseringsstatus.

## App Arkitektur

### Oversikt

Dette prosjektet følger en typisk webapplikasjonsarkitektur med en klar separasjon mellom frontend (klient) og backend (server).

### Backend

- Teknologi: Bygget med Node.js og Express.js.
  
- Hovedfunksjoner:
  - API-endepunkter: Behandler brukerforespørsler for autentisering, blogginnleggshåndtering og datahenting.
  - Databasekommunikasjon: Kobler til og håndterer data i SQLite-databasen.
  - Sikkerhet: Implementerer JWT for autentisering og bcrypt for passordhashing.
- 
- Struktur:
  - Routes: Definerer API-endepunkter og kobler dem til tilhørende logikk.
  - Middleware: Håndterer autentisering og feilhåndtering.

### Frontend

- Håndtert av TredjePart: Frontend-delen av applikasjonen er utviklet separat og er ansvarlig for å presentere brukergrensesnittet og håndtere brukerinteraksjoner.
- Kommunikasjon med Backend: Frontend kommuniserer med backend gjennom definerte API-endepunkter, sender forespørsler og mottar responsdata.

## Faglig Vurdering

### Evaluering av eget arbeid

- Selve oppgaven var grei å løse, møtte jo på litt utfordringer når det gjaldt token.. 

- Hovedårsaken til problemet var kun min egen feil, det var at jeg ikke brukte nok tid på å gå imellom frontend koden, før jeg startet med prosjektet.
  - Jeg hadde 2 hovedproblemer, det var hvordan Token ble sendt i fra backend til frontend, jeg sendte en unik token, frontend forventet ('token').
    -Og når det gjaldt sikkerhet, så hadde jeg satt httpOnly som :true , dette med grunnlag for at javascript da ikke skulle ha tilgang til backendkoden.. Denne måtte endres til false for å få login til å fungere.

Men alt i alt, så syns jeg det gikk bra.

### Veiledning og Justering

_Refleksjon over hvordan arbeidet kunne blitt forbedret med veiledning._


### Kodekvalitet

- Modulær Struktur: Koden er strukturert med moduler og ruter som gjør det lettere å vedlikeholde og gjennbruke.
- Lesbarhet: Koden følger en konsekvent struktur som gjør den oversiktelig og lett å navigere rundt.
- Sikkerhet: Bruken av JWT for autentisering og bcrypt for hashing av passord.
- Feilhåndtering: Systematisk feilhåndtering er implementert, men kan lønne seg å sette opp en egen global errorHandler(helper) hvis prosjektet skal videutvikles.

### Designmønstre og Arkitektur

- MVC-inspirert Struktur: Prosjektet implementerer en struktur som er inspirert av MVC (Model-View-Controller) arkitekturen.
  Selv om det ikke er en streng MVC-implementasjon, reflekterer organiseringen av ruter (som fungerer som controllere)
  og databaselogikk (som modell) en klar separasjon av ansvarsområder. Denne tilnærmingen forbedrer modulariteten og gjør koden mer vedlikeholdbar,
  samtidig som det opprettholder en effektiv organisering av dataflyt og brukergrensesnittlogikk.

- ### For mer informasjon om `MVC`, [Understanding MVC Architecture in Node.js]
- (https://medium.com/@livajorge7understanding-mvc-architecture-in-node-js-a-comprehensive-guide-dcbe9976061b).

- RESTful API: API-endepunktene følger REST-prinsipper.

### Ytelse og Skalerbarhet

- Effektiv Databasebruk: Ved bruk av SQLite og optimaliserte spørringer, håndteres databasetilgang effektivt.
- Potensial for Skalerbarhet: Koden er strukturert på en måte som tillater lett utvidelse og skalerbarhet.
