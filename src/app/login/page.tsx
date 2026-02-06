export default function LoginPage() {
  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input placeholder="Email" className="border p-2 w-full mb-3" />
      <input placeholder="Lozinka" type="password" className="border p-2 w-full mb-3" />
      <button className="w-full bg-black text-white p-2 rounded">
        Uloguj se
      </button>
    </div>
  );
}