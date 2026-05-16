export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0F] px-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
