export default function Loading() {
  return (
    <div className="container" style={{ padding: "24px var(--gutter) 48px" }} aria-busy="true" aria-label="Loading">
      <div className="lead-grid">
        <div>
          <div className="skeleton" style={{ aspectRatio: "16/10" }} />
          <div className="skeleton sk-line" style={{ height: 28, width: "90%", marginTop: 16 }} />
          <div className="skeleton sk-line" style={{ height: 28, width: "70%" }} />
          <div className="skeleton sk-line" style={{ width: "95%" }} />
          <div className="skeleton sk-line" style={{ width: "60%" }} />
        </div>
        <div>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ marginBottom: 24 }}>
              <div className="skeleton sk-line" style={{ width: "30%" }} />
              <div className="skeleton sk-line" style={{ height: 20 }} />
              <div className="skeleton sk-line" style={{ height: 20, width: "80%" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
