ALTER TABLE "klijenti" ADD COLUMN "role" varchar(30) DEFAULT 'KLIJENT' NOT NULL;--> statement-breakpoint
ALTER TABLE "zaposleni" ADD COLUMN "role" varchar(30) DEFAULT 'ZAPOSLENI' NOT NULL;