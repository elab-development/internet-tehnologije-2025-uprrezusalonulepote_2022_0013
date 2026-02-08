import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function AdminHomePage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">Admin panel</h1>
      <p className="opacity-80 mb-6">
        Upravljanje uslugama, zaposlenima, smenama i rezervacijama.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-4 flex flex-col gap-3">
          <div className="font-medium">Usluge</div>
          <div className="text-sm opacity-80">
            Dodavanje, izmena i brisanje usluga.
          </div>
          <Link href="/admin/services" className="mt-auto">
            <Button>Upravljaj uslugama</Button>
          </Link>
        </Card>

        <Card className="p-4 flex flex-col gap-3">
          <div className="font-medium">Zaposleni</div>
          <div className="text-sm opacity-80">
            Pregled zaposlenih i njihovih podataka.
          </div>
          <Link href="/admin/employees" className="mt-auto">
            <Button>Upravljaj zaposlenima</Button>
          </Link>
        </Card>

        <Card className="p-4 flex flex-col gap-3">
          <div className="font-medium">Smene</div>
          <div className="text-sm opacity-80">
            Radne smene po zaposlenom.
          </div>
          <Link href="/admin/employees" className="mt-auto">
            <Button>Pregled smena</Button>
          </Link>
        </Card>

        <Card className="p-4 flex flex-col gap-3">
          <div className="font-medium">Rezervacije</div>
          <div className="text-sm opacity-80">
            Pregled svih zakazanih termina.
          </div>
          <Link href="/admin/appointments" className="mt-auto">
            <Button>Pregled rezervacija</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}