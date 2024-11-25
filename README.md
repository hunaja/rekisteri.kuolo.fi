## rekisteri.kuolo.fi

Tämä repositorio sisältää KuoLO Ry:n jäsenrekisterisivujen lähdekoodin.

### Asennus

Kopioi tiedoston `.env.example` sisältö tietokoneellesi ja muokkaa tarvittavat tiedot oikeiksi.

- Auth0:n muuttujia vastaavat tiedot löytyvät helposti heidän sivuiltaan (sovelluksen luotuasi).

- Tietokannan tarvitseman `MONGODB_URL`-muuttujan saat MongoDB Atlaksesta helposti (docker compose tulossa).

- Muuttujan `NEXTAUTH_URL` on osoitettava koko verkkosivustojesi osoitteeseen plus `/api/auth`.

Kun olet säätänyt tarvittavat muuttujat oikeiksi, uudelleennimeä tiedoston nimeksi `.env.local` ja suorita seuraava komento samassa terminaali-ikkunassa:

```bash

docker run --env-file=.env.local -p 3000:3000 ghcr.io/hunaja/rekisteri.kuolo.fi:main
```

### Todo

- Docker compose

- Tasokkaampaa koodia

- Testit

- Muut jäsensivujen ominaisuudet
