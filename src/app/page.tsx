import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">Salon lepote</h1>
      <p className="opacity-80 mb-6">
        Dobrodošla! Izaberi šta želiš da uradiš.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-4 flex flex-col gap-3">
          <div className="font-medium">Zakazivanje termina</div>
          <div className="text-sm opacity-80">
            Klijent može da zakaže termin i vidi svoje rezervacije.
          </div>
          <Link href="/appointments" className="mt-auto">
            <Button>Idi na Termine</Button>
          </Link>
        </Card>

        <Card className="p-4 flex flex-col gap-3">
          <div className="font-medium">Usluge</div>
          <div className="text-sm opacity-80">
            Pregled usluga. Admin ima mogućnost upravljanja.
          </div>
          <Link href="/services" className="mt-auto">
            <Button>Idi na Usluge</Button>
          </Link>
        </Card>

        <Card className="p-4 flex flex-col gap-3">
          <div className="font-medium">Admin panel</div>
          <div className="text-sm opacity-80">
            Usluge, zaposleni, smene i rezervacije (samo ADMIN).
          </div>
          <Link href="/admin" className="mt-auto">
            <Button>Idi na Admin</Button>
          </Link>
        </Card>

        <Card className="p-4 flex flex-col gap-3">
          <div className="font-medium">Nalog</div>
          <div className="text-sm opacity-80">
            Login/registracija za mock autentifikaciju.
          </div>
          <div className="mt-auto flex gap-2">
            <Link href="/login">
              <Button>Login</Button>
            </Link>
            <Link href="/register">
              <Button>Registracija</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}