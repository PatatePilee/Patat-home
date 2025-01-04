"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";

type PageSetting = {
  id: number;
  name: string;
  title: string;
  path: string;
  isActive: number;
};

export default function PageSettings() {
  const [pages, setPages] = useState<PageSetting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch("/api/admin/pages");
      if (!response.ok) throw new Error("Erreur lors de la récupération");
      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (pageId: number, currentState: number) => {
    try {
      const response = await fetch(`/api/admin/pages/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: currentState === 0 ? 1 : 0 }),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour");

      setPages(
        pages.map((page) =>
          page.id === pageId
            ? { ...page, isActive: page.isActive === 0 ? 1 : 0 }
            : page
        )
      );
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  if (loading) return <div className="text-white">Chargement...</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {pages.map((page) => (
          <div
            key={page.id}
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
          >
            <div>
              <h3 className="text-lg font-medium text-white">{page.title}</h3>
              <p className="text-sm text-gray-400">{page.path}</p>
            </div>
            <Switch
              checked={page.isActive === 1}
              onChange={() => handleToggle(page.id, page.isActive)}
              className={`${
                page.isActive === 1 ? "bg-blue-600" : "bg-gray-600"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
            >
              <span
                className={`${
                  page.isActive === 1 ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        ))}
      </div>
    </div>
  );
}
