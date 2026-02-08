import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <Card className="p-8 max-w-md w-full text-center flex flex-col gap-4">
        <h1 className="text-3xl font-bold">404</h1>

        <p className="text-gray-600">
          Stranica koju tražiš ne postoji ili je premeštena.
        </p>

        <div className="flex justify-center gap-3 mt-2">
          <Link href="/">
            <Button>Početna</Button>
          </Link>

          <Link href="/appointments">
            <Button>Termini</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}