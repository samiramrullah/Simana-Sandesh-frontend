export default function StaticPage({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return (
    <div className="container article-page">
      <div className="article-main" style={{ margin: "0 auto" }}>
        <header className="article-header" style={{ marginBottom: 28 }}>
          <h1 className="headline">{title}</h1>
          {intro && <p className="standfirst">{intro}</p>}
        </header>
        <div className="article-body static-body">{children}</div>
      </div>
    </div>
  );
}
