"use client";
import { useState, useEffect } from "react";

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: number;
};

type EditingUser = {
  id: number;
  username: string;
  email: string;
  role: string;
  password?: string;
};

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<EditingUser | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs:",
          error
        );
      }
    };

    fetchUsers();
  }, []);

  const handleStartEdit = (user: User) => {
    setEditingUser({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        const response = await fetch(`/api/admin/users/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setUsers(users.filter((user) => user.id !== id));
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const handleEdit = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(
          users.map((user) => (user.id === editingUser.id ? updatedUser : user))
        );
        setEditingUser(null);
      }
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
    }
  };

  return (
    <div data-component="users-table" className="overflow-x-auto">
      <table className="min-w-full bg-white/5 rounded-lg">
        <thead>
          <tr>
            <th className="p-4">ID</th>
            <th className="p-4">Nom d'utilisateur</th>
            <th className="p-4">Email</th>
            <th className="p-4">Rôle</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-white/10">
              <td className="p-4">{user.id}</td>
              <td className="p-4">
                {editingUser?.id === user.id ? (
                  <input
                    type="text"
                    value={editingUser.username}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        username: e.target.value,
                      })
                    }
                    className="w-full p-1 bg-white/10 rounded"
                  />
                ) : (
                  user.username
                )}
              </td>
              <td className="p-4">
                {editingUser?.id === user.id ? (
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        email: e.target.value,
                      })
                    }
                    className="w-full p-1 bg-white/10 rounded"
                  />
                ) : (
                  user.email
                )}
              </td>
              <td className="p-4">
                {editingUser?.id === user.id ? (
                  <select
                    value={editingUser.role}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        role: e.target.value,
                      })
                    }
                    className="p-1 bg-white/10 rounded"
                  >
                    <option value="user">Utilisateur</option>
                    <option value="admin">Administrateur</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td className="p-4">
                {editingUser?.id === user.id ? (
                  <div className="space-x-2">
                    <button
                      onClick={handleEdit}
                      className="px-3 py-1 bg-green-600 rounded hover:bg-green-700"
                    >
                      Sauvegarder
                    </button>
                    <button
                      onClick={() => setEditingUser(null)}
                      className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleStartEdit(user)}
                      className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
