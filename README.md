# Beyond Now - Planiranje zaposlenih po projektih

# funkcionalnosti projekta
- pregled podatkov podjetja kot osebe z razlicnimi vlogami:
    - resource manager
    - project manager
    - department leader 
- graficni prikazi:
    - trajanje projekta
    - obdobje 
    - zasedenost zaposlenih
- dodajanje zaposlenih
- dodajanje projektov
- pregled dolocenih zaposlenih na projektih

# zagon projekta
## frontend
- pomik v frontend mapo
- npm i
- ustvari ustrezen .env
- npm run dev (lokalno) --> projekt dostopen na spletu: [Tukaj](https://beyondnow-d513a.web.app/)

## backend
- pomik v backend mapo
- npm i
- ustvari ustrezen .env
- nastavi prismo: npx prisma generate 
- npx ts-node src/index.ts (lokalno)

## baza
- da posodobis podatke iz baze: npx prisma db pull
