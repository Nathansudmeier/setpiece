import RevealInit from "@/components/RevealInit";

// Template remount per navigatie zodat reveal-on-scroll op elke pagina opnieuw bindt.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RevealInit />
      {children}
    </>
  );
}
