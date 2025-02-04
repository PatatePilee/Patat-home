export default function DarkLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3a1818] to-black text-white">
      {children}
    </div>
  );
} 