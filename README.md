# Aplikacija za rezervaciju termina u kozmetičkom salonu
## Opis projekta

Web aplikacija namenjena upravljanju i rezervaciji termina u kozmetičkom salonu.
Sistem omogućava korisnicima pregled dostupnih termina, registraciju i prijavu na sistem, kao i rezervaciju željenih usluga. Administrator ima pristup posebnom panelu kroz koji može upravljati korisnicima, terminima i rezervacijama.

Aplikacija je realizovana kao full-stack rešenje sa klijentskim i serverskim delom i koristi relaciju bazu podataka za čuvanje podataka.

## Funkcionalnosti

- Registracija korisnika
- Prijava i autentifikacija
- Autorizacija po ulogama (ADMIN / USER)
- Rezervacija termina
- Pregled sopstvenih rezervacija
- Admin panel
- Upravljanje korisnicima
- Upravljanje terminima
- Upravljanje rezervacijama

---

## Korišćene tehnologije

- Next.js – razvoj web aplikacije
- React – korisnički interfejs
- TypeScript – tipizirani JavaScript
- Node.js – serversko okruženje
- PostgreSQL – relaciona baza podataka
- Drizzle ORM – ORM za komunikaciju sa bazom
- Docker – kontejnerizacija aplikacije
- Docker Compose – orkestracija servisa

---

## Pokretanje aplikacije lokalno (bez Docker-a)
### 1. Kloniranje repozitorijuma
git clone
### 2. Instalacija zavisnosti
npm install
### 3. Kreiranje .env fajla
U root direktorijumu kreirati .env fajl sa sledećim parametrima:
DATABASE_URL=postgres://postgres:postgres@localhost:5432/beauty-salon <br>
JWT_SECRET=your_secret_key <br>
JWT_EXPIRES=7d <br>
API_URL=http://localhost:3001 <br>
### 4. Pokretanje baze podataka
Potrebno je imati instaliran PostgreSQL server i kreiranu bazu podataka pod nazivom beauty-salon.
### 5. Pokretanje migracija
npx drizzle-kit push
### 6. Pokretanje aplikacije
npm run dev

Aplikacija će biti dostupna na:
http://localhost:3000

## Pokretanje aplikacije pomoću Docker-a
1. Build aplikacije <br>
docker-compose build
2. Pokretanje kontejnera <br>
docker-compose up

Ovim se pokreću:
- aplikacioni server i
- PostgreSQL baza podataka.

Aplikacija će biti dostupna na: http://localhost:3000 <br>
 3.  Gašenje kontejnera <br>
docker-compose down
