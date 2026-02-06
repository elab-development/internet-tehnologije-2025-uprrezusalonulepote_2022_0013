import { getAllUsers } from "@/lib/admin.client";
import { authMe } from "@/lib/auth.client";

export default async function AdminPage() {
  const me = await authMe();

  if (!me || me.role !== "ADMIN") {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Admin</h1>
        <p>Nemaš pristup.</p>
      </div>
    );
  }

  const users = await getAllUsers();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin panel</h1>
      <ul className="space-y-3">
        {users.map((u) => (
          <li key={u.id} className="border p-4 rounded flex justify-between">
            <span>{u.name}</span>
            <span>{u.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}