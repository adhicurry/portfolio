import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ maxWidth: 900, margin: "4rem auto", padding: "0 2rem", fontFamily: "Georgia, serif" }}>
      <h1>Page not found</h1>
      <p><Link href="/">Return to the homepage</Link></p>
    </main>
  );
}
