export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="w-3/4 mx-auto">{children}</div>;
}
