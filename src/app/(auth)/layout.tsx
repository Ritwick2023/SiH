export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F4F6FB] text-[#1F273A] flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 antialiased selection:bg-[#1C4CA1] selection:text-white">
      {children}
    </div>
  );
}
