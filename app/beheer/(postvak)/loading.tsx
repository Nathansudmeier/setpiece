// Skeleton in de vorm van de postvaklijst, geen spinner.
export default function PostvakLoading() {
  return (
    <section className="bh-page" aria-busy="true" aria-label="Postvak laden">
      <div className="bh-skeleton bh-skeleton--title" />
      <div className="bh-skeleton bh-skeleton--sub" />
      <div className="bh-skeleton bh-skeleton--tabs" />
      <div className="bh-skeleton-list">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="bh-skeleton bh-skeleton--row" />
        ))}
      </div>
    </section>
  );
}
