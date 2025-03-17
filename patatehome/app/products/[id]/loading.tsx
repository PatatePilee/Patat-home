import DarkLayout from "@/app/layouts/DarkLayout";

export default function Loading() {
  return (
    <DarkLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl text-white">Chargement du produit...</div>
        </div>
      </div>
    </DarkLayout>
  );
}
