CREATE TABLE "klijenti" (
	"id_klijenta" serial PRIMARY KEY NOT NULL,
	"ime" varchar(60) NOT NULL,
	"prezime" varchar(60) NOT NULL,
	"email" varchar(120) NOT NULL,
	"lozinka" varchar(255) NOT NULL,
	"br_telefona" varchar(30) NOT NULL,
	"adresa" varchar(255),
	"korisnicko_ime" varchar(60) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "radna_mesta" (
	"id_radnog_mesta" serial PRIMARY KEY NOT NULL,
	"naziv" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "radne_smene" (
	"id_smene" serial PRIMARY KEY NOT NULL,
	"datum" date NOT NULL,
	"pocetak_smene" time NOT NULL,
	"kraj_smene" time NOT NULL,
	"zaposleni_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rezervacija_usluge" (
	"rezervacija_id" integer NOT NULL,
	"usluga_id" integer NOT NULL,
	CONSTRAINT "rezervacija_usluge_rezervacija_id_usluga_id_pk" PRIMARY KEY("rezervacija_id","usluga_id")
);
--> statement-breakpoint
CREATE TABLE "rezervacije" (
	"id_rezervacije" serial PRIMARY KEY NOT NULL,
	"datum_vreme" timestamp NOT NULL,
	"napomena" text,
	"status" varchar(30) NOT NULL,
	"klijent_id" integer NOT NULL,
	"zaposleni_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usluge" (
	"id_usluga" serial PRIMARY KEY NOT NULL,
	"naziv" varchar(120) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "zaposleni" (
	"id_zaposleni" serial PRIMARY KEY NOT NULL,
	"ime" varchar(60) NOT NULL,
	"prezime" varchar(60) NOT NULL,
	"email" varchar(120) NOT NULL,
	"lozinka" varchar(255) NOT NULL,
	"radno_mesto_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "zaposleni_usluge" (
	"zaposleni_id" integer NOT NULL,
	"usluga_id" integer NOT NULL,
	CONSTRAINT "zaposleni_usluge_zaposleni_id_usluga_id_pk" PRIMARY KEY("zaposleni_id","usluga_id")
);
--> statement-breakpoint
ALTER TABLE "radne_smene" ADD CONSTRAINT "radne_smene_zaposleni_id_zaposleni_id_zaposleni_fk" FOREIGN KEY ("zaposleni_id") REFERENCES "public"."zaposleni"("id_zaposleni") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rezervacija_usluge" ADD CONSTRAINT "rezervacija_usluge_rezervacija_id_rezervacije_id_rezervacije_fk" FOREIGN KEY ("rezervacija_id") REFERENCES "public"."rezervacije"("id_rezervacije") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rezervacija_usluge" ADD CONSTRAINT "rezervacija_usluge_usluga_id_usluge_id_usluga_fk" FOREIGN KEY ("usluga_id") REFERENCES "public"."usluge"("id_usluga") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rezervacije" ADD CONSTRAINT "rezervacije_klijent_id_klijenti_id_klijenta_fk" FOREIGN KEY ("klijent_id") REFERENCES "public"."klijenti"("id_klijenta") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rezervacije" ADD CONSTRAINT "rezervacije_zaposleni_id_zaposleni_id_zaposleni_fk" FOREIGN KEY ("zaposleni_id") REFERENCES "public"."zaposleni"("id_zaposleni") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zaposleni" ADD CONSTRAINT "zaposleni_radno_mesto_id_radna_mesta_id_radnog_mesta_fk" FOREIGN KEY ("radno_mesto_id") REFERENCES "public"."radna_mesta"("id_radnog_mesta") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zaposleni_usluge" ADD CONSTRAINT "zaposleni_usluge_zaposleni_id_zaposleni_id_zaposleni_fk" FOREIGN KEY ("zaposleni_id") REFERENCES "public"."zaposleni"("id_zaposleni") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zaposleni_usluge" ADD CONSTRAINT "zaposleni_usluge_usluga_id_usluge_id_usluga_fk" FOREIGN KEY ("usluga_id") REFERENCES "public"."usluge"("id_usluga") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "klijenti_email_uq" ON "klijenti" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "klijenti_korisnickoime_uq" ON "klijenti" USING btree ("korisnicko_ime");--> statement-breakpoint
CREATE UNIQUE INDEX "zaposleni_email_uq" ON "zaposleni" USING btree ("email");