import Link from "next/link";

export default function HomePage() {
  return (
    <main className="public-shell">
      <nav className="public-nav">
        <Link className="brand" href="/">
          <span className="brand-mark">م</span><span>Madrasa Québec</span>
        </Link>
        <div className="nav-links"><a href="#fonctionnalites">Fonctionnalités</a><a href="#familles">Pour les familles</a><a href="#communaute">Communauté</a></div>
        <div className="nav-actions"><Link className="button button-soft" href="/student">Voir l’espace élève</Link><Link className="button button-primary" href="/parent">Ouvrir le tableau de bord</Link></div>
      </nav>
      <section className="hero">
        <div>
          <div className="eyebrow">Apprendre en famille, avec confiance</div>
          <h1>Un parcours clair pour une <em>éducation complète.</em></h1>
          <p className="hero-copy">Madrasa Québec aide les familles à organiser les apprentissages, suivre la progression des enfants et créer une vraie communauté autour de l’éducation à la maison.</p>
          <div className="hero-actions"><Link className="button button-primary" href="/parent">Commencer le parcours</Link><a className="button button-soft" href="#fonctionnalites">Découvrir comment ça marche</a></div>
          <div className="proof-line">Planifier · apprendre · pratiquer · se retrouver</div>
        </div>
        <div className="product-preview" aria-label="Aperçu du tableau de bord">
          <div className="preview-top"><span>Tableau de bord parent</span><span>Cette semaine</span></div>
          <div className="preview-content"><div className="preview-side"><div className="active">Accueil</div><div>Plan</div><div>Cours</div><div>IA</div><div>Portfolio</div></div><div className="preview-main"><div className="eyebrow">Bonjour, Amine</div><h3>Votre semaine, en un regard.</h3><div className="mini-card"><strong>Parcours Québec</strong><p>3 prochaines étapes à préparer</p><div className="mini-progress"><span /></div></div><div className="mini-card"><strong>Mission d’aujourd’hui</strong><p>Fractions · 25 min · Adam</p></div></div></div>
        </div>
      </section>
      <section className="section" id="fonctionnalites"><div className="section-heading"><div><div className="eyebrow">Ce qui devient plus simple</div><h2>Tout ce dont la famille a besoin pour avancer.</h2></div><p>Une seule vue pour les échéances, les cours, les preuves de progression et les moments d’apprentissage ensemble.</p></div><div className="feature-grid"><article className="feature"><div className="feature-icon">◒</div><h3>Parcours Québec</h3><p>Préparer les étapes, les objectifs et les documents avec des rappels vérifiables.</p></article><article className="feature"><div className="feature-icon">✦</div><h3>Tuteur qui fait réfléchir</h3><p>Des indices et des questions adaptées, sans faire le devoir à la place de l’élève.</p></article><article className="feature"><div className="feature-icon">◌</div><h3>Apprendre ensemble</h3><p>Des classes collaboratives pour discuter, présenter ses idées et progresser en groupe.</p></article></div></section>
      <footer className="public-footer"><span>© 2026 Madrasa Québec</span><span>Conçu pour les familles. Vérifié par les humains.</span></footer>
    </main>
  );
}
