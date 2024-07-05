import '../globals.css';

export const metadata = {
  title: 'RC Two Down Calculator',
  description: 'A game to track 3-4 ball wagers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
