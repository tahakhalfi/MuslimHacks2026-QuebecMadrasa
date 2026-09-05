import Link from "next/link";

const features = [
  { icon: "⚜", title: "Parcours Québec", text: "Un parcours structuré qui aide la famille à suivre les attentes et les échéances québécoises." },
  { icon: "▤", title: "Apprendre", text: "Des cours académiques, des projets et des apprentissages islamiques réunis dans une même semaine." },
  { icon: "✦", title: "Tuteur IA sécurisé", text: "Un accompagnement qui explique, questionne et aide l’enfant à raisonner sans faire le travail à sa place." },
  { icon: "♟", title: "Pods locaux", text: "Des petits groupes de familles pour discuter, apprendre ensemble et se retrouver près de chez vous." },
];

export default function HomePage() {
  return (
    <main className="real-landing">
      <header className="real-nav-wrap">
        <nav className="real-nav" aria-label="Navigation principale">
          <Link href="/" className="real-brand"><img className="site-logo-image" src="/ui/logo-madrasa-quebec.png" alt="Madrasa Québec Network" /></Link>
          <div className="real-nav-links">
            <a href="#familles">Pour les familles</a>
            <a href="#fonctionnement">Comment ça marche</a>
            <a href="#pods">Pods</a>
            <a href="#securite">Sécurité</a>
            <a href="#tarifs">Tarifs</a>
          </div>
          <div className="real-nav-actions"><Link href="/parent" className="real-button real-button-outline">Se connecter</Link><Link href="/parent" className="real-button real-button-dark">Commencer gratuitement</Link></div>
        </nav>
      </header>

      <section className="real-hero" id="familles">
        <div className="real-hero-copy">
          <p className="real-eyebrow">Apprendre à la maison, avec confiance</p>
          <h1>Le parcours complet<br />pour apprendre à la maison</h1>
          <p className="real-lead">Conforme au contexte québécois. Adapté aux familles musulmanes. Pensé pour les enfants.</p>
          <div className="real-trust-row"><span><b>⚜</b><strong>Conforme au<br />contexte québécois</strong></span><span><b>▤</b><strong>Académique<br />et islamique</strong></span><span><b>♙</b><strong>Sécurisé<br />et privé</strong></span><span><b>♟</b><strong>Communauté<br />locale</strong></span></div>
          <div className="real-hero-actions"><Link href="/parent" className="real-button real-button-dark real-button-large">✦ &nbsp; Créer mon parcours gratuitement</Link><a href="#fonctionnement" className="real-button real-button-outline real-button-large">▷ &nbsp; Voir comment ça marche</a></div>
        </div>
        <div className="real-hero-art"><img src="/ui/family-hero.png" alt="Une famille apprend ensemble à la maison au Québec" /></div>
      </section>

      <section className="real-feature-grid" id="fonctionnement" aria-label="Fonctionnalités principales">{features.map((feature) => <article className="real-feature-card" key={feature.title}><div className="real-feature-icon">{feature.icon}</div><h2>{feature.title}</h2><p>{feature.text}</p><ul><li>Progression claire</li><li>Activités adaptées</li><li>Contrôle par le parent</li></ul></article>)}</section>

      <section className="real-how section-light" id="pods"><div><p className="real-eyebrow">Une semaine qui a du sens</p><h2>Un système qui relie le parent, l’élève et la communauté.</h2></div><div className="real-step-list"><div><span>01</span><p><strong>Planifier</strong><br />Choisir les objectifs et les activités de la semaine.</p></div><div><span>02</span><p><strong>Apprendre</strong><br />Suivre des leçons, jouer, pratiquer et demander de l’aide.</p></div><div><span>03</span><p><strong>Partager</strong><br />Rejoindre une classe collaborative ou un pod local.</p></div></div></section>

      <section className="real-safety" id="securite"><div><p className="real-eyebrow">Pensé pour protéger l’apprentissage</p><h2>Une plateforme utile sans exposer inutilement la famille.</h2><p>Les parents gardent le contrôle des permissions. Les contenus générés par l’IA sont vérifiés avant d’être ajoutés au parcours. Les enfants ont un espace simple, adapté à leur âge.</p><Link href="/parent" className="real-text-link">Voir le tableau de bord parent →</Link></div><div className="real-safety-card"><div>✓</div><h3>Privé par défaut</h3><p>Pas de publicité ciblée. Pas de données publiques sur les enfants. Pas de publication automatique.</p><hr /><div>✓</div><h3>Humain dans la boucle</h3><p>Le parent ou le tuteur valide les contenus importants.</p></div></section>

      <section className="real-pricing" id="tarifs"><p className="real-eyebrow">Commencer simplement</p><h2>Un premier mois pour découvrir votre rythme.</h2><p>Le prototype local est gratuit. Les plans réels seront décidés après validation des besoins des familles.</p><Link href="/parent" className="real-button real-button-dark">Créer mon parcours</Link></section>

      <footer className="real-footer"><div><Link href="/" className="real-brand"><img className="site-logo-image" src="/ui/logo-madrasa-quebec.png" alt="Madrasa Québec Network" /></Link><p>Apprendre en famille. Grandir en communauté.</p></div><div className="real-footer-links"><div><strong>Produit</strong><a href="#fonctionnement">Fonctionnalités</a><Link href="/parent">Espace parent</Link><Link href="/student">Espace élève</Link></div><div><strong>Confiance</strong><a href="#securite">Sécurité</a><a href="#familles">Pour les familles</a><a href="#tarifs">Tarifs</a></div><div><strong>Projet</strong><a href="#pods">Communauté</a><a href="#fonctionnement">Comment ça marche</a></div></div><div className="real-footer-bottom"><span>© 2026 Madrasa Québec</span><span>Conçu pour les familles. Vérifié par les humains.</span></div></footer>
    </main>
  );
}
