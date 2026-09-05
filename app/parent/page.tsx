"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  computeProgress,
  markTaskDone,
  pendingCount,
  visibleForChild,
  type ParentTask,
} from "@/src/domain/parent-dashboard";
import {
  fallbackFamily,
  familyInitials,
  readStoredFamily,
  readStoredLocale,
  writeStoredLocale,
  type Locale,
  type StoredFamily,
} from "@/src/lib/family-store";

type CssVars = React.CSSProperties & { "--pct"?: string };

const subjectKeys = ["french", "math", "social", "science"] as const;

const sidebarLinks = [
  ["⌂", "home", "/parent"],
  ["☷", "weekPlan", "/parent/plan"],
  ["▣", "courses", "#"],
  ["✦", "assistant", "#"],
  ["◌", "community", "#"],
  ["▤", "portfolio", "#"],
  ["◫", "quebecPath", "#"],
  ["$", "budget", "#"],
] as const;

const demoSubjectPatterns: { key: (typeof subjectKeys)[number]; done: boolean }[][] = [
  [
    { key: "french", done: true },
    { key: "math", done: true },
    { key: "social", done: false },
    { key: "science", done: true },
  ],
  [
    { key: "french", done: true },
    { key: "math", done: true },
    { key: "social", done: false },
    { key: "science", done: false },
  ],
];

function subjectsForIndex(index: number) {
  return demoSubjectPatterns[index % demoSubjectPatterns.length];
}

function frDe(name: string): string {
  return /^[aeiouyhAEIOUYH]/.test(name) ? `d’${name}` : `de ${name}`;
}

function buildInitialTasks(family: StoredFamily): ParentTask[] {
  const reviewId = family.children[0].id;
  const portfolioId = family.children[1]?.id ?? reviewId;
  return [
    { id: "fractions-review", childId: reviewId, status: "pending", dueAt: "2026-09-12" },
    { id: "portfolio-evidence", childId: portfolioId, status: "pending" },
    { id: "pod-booking", childId: null, status: "pending" },
  ];
}

function buildActivityItems(family: StoredFamily): { id: string; childId: string | null; icon: string }[] {
  const reviewId = family.children[0].id;
  const portfolioId = family.children[1]?.id ?? reviewId;
  return [
    { id: "child1-opinion", childId: reviewId, icon: "▤" },
    { id: "child2-solids", childId: portfolioId, icon: "✓" },
    { id: "pod-confirmed", childId: null, icon: "◌" },
    { id: "child1-portfolio", childId: reviewId, icon: "▤" },
  ];
}

function buildUpcomingItems(family: StoredFamily): { id: string; childId: string | null }[] {
  return [
    { id: "pod-thursday", childId: null },
    { id: "fractions-due", childId: family.children[0].id },
  ];
}

const copy = {
  fr: {
    sidebarLabel: "Famille",
    sidebarLinks: { home: "Accueil", weekPlan: "Plan de la semaine", courses: "Cours", assistant: "Assistant IA", community: "Communauté", portfolio: "Portfolio", quebecPath: "Parcours Québec", budget: "Budget" },
    sidebarBottom: "Votre espace reste privé. Les contenus générés par l’IA nécessitent votre validation.",
    eyebrow: "Espace parent · semaine du 7 septembre",
    helloPrefix: "Bonjour,",
    heroLabel: "Votre prochain geste",
    heroTitle: "Préparer le projet d’apprentissage.",
    heroText: "Il reste des éléments à vérifier avant de générer votre brouillon pour le parcours Québec.",
    heroCta: "Continuer",
    metricProgress: "Progression familiale", metricTasks: "Tâches à valider", metricNext: "Prochaine échéance",
    metricProgressFoot: "Moyenne des enfants", metricTasksFoot: "contenu(s) ou action(s) en attente", metricNextFoot: "Leçon de fractions à valider",
    filterLabel: "Afficher", filterAll: "Toute la famille",
    ageBandLabels: { "5-8": "5 à 8 ans", "9-12": "9 à 12 ans", "13-15": "13 à 15 ans", "16-17": "16 à 17 ans" } as Record<string, string>,
    subjectNames: { french: "Français", math: "Mathématiques", social: "Univers social", science: "Sciences" } as Record<string, string>,
    progressTitle: "Progression de la semaine", complete: "Complété",
    activityTitle: "Activité récente",
    activityText: {
      "child1-opinion": (name: string) => [`${name} a soumis son texte d’opinion.`, "Français"] as [string, string],
      "child2-solids": (name: string) => [`${name} a complété la leçon sur les solides.`, "Mathématiques"] as [string, string],
      "pod-confirmed": () => ["Séance de pod confirmée pour jeudi.", "Groupe familial · 16 h 30"] as [string, string],
      "child1-portfolio": (name: string) => [`Nouveau document ajouté au portfolio ${frDe(name)}.`, "Projet · Le système solaire"] as [string, string],
    } as Record<string, (name: string) => [string, string]>,
    actionsTitle: "Prochaines actions",
    tasks: {
      "fractions-review": { title: "Valider le cours de fractions", meta: (name: string) => `Généré pour ${name} · 25 min`, cta: "Ouvrir", tag: "À valider", done: "Validé",
        detail: (name: string) => `Un cours de révision sur les fractions a été généré pour ${name}. Vérifiez le contenu avant de l’ajouter à son parcours.`, confirm: "Marquer comme validé" },
      "portfolio-evidence": { title: "Ajouter une preuve au portfolio", meta: (name: string) => `${name} · Sciences et technologie`, cta: "Ajouter", tag: "Cette semaine", done: "Ajoutée",
        detail: (name: string) => `Ajoutez une preuve (photo, document ou lien) au portfolio ${frDe(name)} pour son projet de sciences.`, confirm: "Marquer comme ajoutée" },
      "pod-booking": { title: "Choisir une classe collaborative", meta: () => "Jeudi · 16 h 30 · 6 places", cta: "Réserver", tag: "Réserver", done: "Confirmé",
        detail: () => "Confirmez la place de votre famille pour la classe collaborative de jeudi 16 h 30 (Sciences, 6 places disponibles).", confirm: "Confirmer la réservation" },
    } as Record<string, { title: string; meta: (name: string) => string; cta: string; tag: string; done: string; detail: (name: string) => string; confirm: string }>,
    alertTitle: "Échéance à vérifier", alertCta: "Voir les détails",
    alertText: (name: string) => `La leçon de fractions ${frDe(name)} est à valider avant le 12 septembre.`,
    upcomingTitle: "À venir", weekPlanCta: "Voir le plan de la semaine →",
    upcomingText: {
      "pod-thursday": () => ["Séance de pod en famille", "Jeudi · 16 h 00"] as [string, string],
      "fractions-due": (name: string) => ["Échéance : leçon de fractions", `12 sept. · ${name}`] as [string, string],
    } as Record<string, (name: string) => [string, string]>,
    close: "Fermer",
  },
  en: {
    sidebarLabel: "Family",
    sidebarLinks: { home: "Home", weekPlan: "Week plan", courses: "Courses", assistant: "AI assistant", community: "Community", portfolio: "Portfolio", quebecPath: "Quebec pathway", budget: "Budget" },
    sidebarBottom: "Your space stays private. AI-generated content needs your review.",
    eyebrow: "Parent space · week of September 7",
    helloPrefix: "Hello,",
    heroLabel: "Your next step",
    heroTitle: "Prepare the learning project.",
    heroText: "A few things are left to check before generating your Quebec pathway draft.",
    heroCta: "Continue",
    metricProgress: "Family progress", metricTasks: "Tasks to review", metricNext: "Next deadline",
    metricProgressFoot: "Average of the children", metricTasksFoot: "item(s) or action(s) pending", metricNextFoot: "Fractions lesson to review",
    filterLabel: "Show", filterAll: "Whole family",
    ageBandLabels: { "5-8": "5–8 years old", "9-12": "9–12 years old", "13-15": "13–15 years old", "16-17": "16–17 years old" } as Record<string, string>,
    subjectNames: { french: "French", math: "Math", social: "Social studies", science: "Science" } as Record<string, string>,
    progressTitle: "This week's progress", complete: "Complete",
    activityTitle: "Recent activity",
    activityText: {
      "child1-opinion": (name: string) => [`${name} submitted an opinion text.`, "French"] as [string, string],
      "child2-solids": (name: string) => [`${name} completed the lesson on solids.`, "Math"] as [string, string],
      "pod-confirmed": () => ["Pod session confirmed for Thursday.", "Family group · 4:30 PM"] as [string, string],
      "child1-portfolio": (name: string) => [`New document added to ${name}'s portfolio.`, "Project · The solar system"] as [string, string],
    } as Record<string, (name: string) => [string, string]>,
    actionsTitle: "Next actions",
    tasks: {
      "fractions-review": { title: "Review the fractions lesson", meta: (name: string) => `Generated for ${name} · 25 min`, cta: "Open", tag: "To review", done: "Reviewed",
        detail: (name: string) => `A review lesson on fractions was generated for ${name}. Check the content before adding it to their path.`, confirm: "Mark as reviewed" },
      "portfolio-evidence": { title: "Add a portfolio proof", meta: (name: string) => `${name} · Science and technology`, cta: "Add", tag: "This week", done: "Added",
        detail: (name: string) => `Add a proof (photo, document or link) to ${name}'s portfolio for their science project.`, confirm: "Mark as added" },
      "pod-booking": { title: "Choose a collaborative class", meta: () => "Thursday · 4:30 PM · 6 spots", cta: "Book", tag: "Book", done: "Confirmed",
        detail: () => "Confirm your family's spot for Thursday's collaborative class (Science, 6 spots available).", confirm: "Confirm the booking" },
    } as Record<string, { title: string; meta: (name: string) => string; cta: string; tag: string; done: string; detail: (name: string) => string; confirm: string }>,
    alertTitle: "Deadline to review", alertCta: "See details",
    alertText: (name: string) => `${name}'s fractions lesson needs review before September 12.`,
    upcomingTitle: "Coming up", weekPlanCta: "View the week plan →",
    upcomingText: {
      "pod-thursday": () => ["Family pod session", "Thursday · 4:00 PM"] as [string, string],
      "fractions-due": (name: string) => ["Due: fractions lesson", `Sep 12 · ${name}`] as [string, string],
    } as Record<string, (name: string) => [string, string]>,
    close: "Close",
  },
} as const;

function buildMonthGrid(today: Date) {
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday-first grid
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: { day: number | null; isToday: boolean }[] = [];
  for (let i = 0; i < startOffset; i += 1) cells.push({ day: null, isToday: false });
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, isToday: day === today.getDate() });
  }
  while (cells.length % 7 !== 0) cells.push({ day: null, isToday: false });
  return { cells, label: today.toLocaleDateString(undefined, { month: "long", year: "numeric" }) };
}

export default function ParentPage() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [hydrated, setHydrated] = useState(false);
  const [family, setFamily] = useState<StoredFamily | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [tasks, setTasks] = useState<ParentTask[]>(() => buildInitialTasks(fallbackFamily("fr")));
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  useEffect(() => {
    const saved = readStoredLocale();
    if (saved) setLocale(saved);

    const loaded = readStoredFamily();
    if (loaded) {
      setFamily(loaded);
      setTasks(buildInitialTasks(loaded));
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeStoredLocale(locale);
  }, [locale, hydrated]);

  const t = copy[locale];
  const activeFamily = family ?? fallbackFamily(locale);
  const childIds = activeFamily.children.map((child) => child.id);
  const childNameById = Object.fromEntries(activeFamily.children.map((child) => [child.id, child.displayName]));
  const activityItems = useMemo(() => buildActivityItems(activeFamily), [activeFamily]);
  const upcomingItems = useMemo(() => buildUpcomingItems(activeFamily), [activeFamily]);

  const weekdayLabels = useMemo(() => {
    const base = new Date(2026, 8, 7); // a Monday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d.toLocaleDateString(locale, { weekday: "short" });
    });
  }, [locale]);
  const month = useMemo(() => buildMonthGrid(new Date()), []);

  const visibleChildIds = filter ? [filter] : childIds;
  const visibleTasks = visibleForChild(tasks, filter);
  const visibleActivity = visibleForChild(activityItems, filter);
  const visibleUpcoming = visibleForChild(upcomingItems, filter);
  const familyProgress = Math.round(
    activeFamily.children.reduce((sum, _child, index) => sum + computeProgress(subjectsForIndex(index)), 0) / activeFamily.children.length,
  );
  const openTask = openTaskId ? tasks.find((task) => task.id === openTaskId) : undefined;
  const openTaskCopy = openTask ? t.tasks[openTask.id] : undefined;
  const openTaskChildName = openTask?.childId ? childNameById[openTask.childId] ?? "" : "";
  const fractionsTask = tasks.find((task) => task.id === "fractions-review");
  const initials = familyInitials(activeFamily.parentName, activeFamily.name);

  return <main className="app-shell">
    <aside className="sidebar">
      <Link className="brand" href="/"><img className="sidebar-logo-image" src="/ui/logo-madrasa-quebec.png" alt="Madrasa Québec Network" /></Link>
      <div className="side-label">{t.sidebarLabel}</div>
      {sidebarLinks.map(([icon, key, href]) => <Link key={key} className={`side-link ${href === "/parent" ? "active" : ""}`} href={href}><span>{icon}</span><span>{t.sidebarLinks[key as keyof typeof t.sidebarLinks]}</span></Link>)}
      <div className="real-language-switch sidebar-lang" aria-label={locale === "fr" ? "Choisir la langue" : "Choose language"}>
        <button className={locale === "fr" ? "active" : ""} onClick={() => setLocale("fr")} aria-pressed={locale === "fr"}>FR</button>
        <button className={locale === "en" ? "active" : ""} onClick={() => setLocale("en")} aria-pressed={locale === "en"}>EN</button>
      </div>
      <div className="sidebar-bottom">{t.sidebarBottom}</div>
    </aside>

    <section className="workspace">
      <div className="workspace-top">
        <div><div className="eyebrow">{t.eyebrow}</div><h1>{t.helloPrefix} {activeFamily.parentName}</h1></div>
        <div className="profile"><span className="avatar">{initials}</span><span>{activeFamily.name}⌄</span></div>
      </div>

      <section className="dash-hero">
        <div><div className="eyebrow" style={{ color: "#a9d8b9" }}>{t.heroLabel}</div><h2>{t.heroTitle}</h2><p>{t.heroText}</p></div>
        <button className="button" onClick={() => setOpenTaskId("fractions-review")}>{t.heroCta}</button>
      </section>

      <div className="metrics">
        <div className="metric-card"><div className="metric-label">{t.metricProgress}</div><div className="metric-value">{familyProgress}%</div><div className="metric-foot">{t.metricProgressFoot}</div></div>
        <div className="metric-card"><div className="metric-label">{t.metricTasks}</div><div className="metric-value">{pendingCount(tasks)}</div><div className="metric-foot">{t.metricTasksFoot}</div></div>
        <div className="metric-card"><div className="metric-label">{t.metricNext}</div><div className="metric-value">12 sept.</div><div className="metric-foot">{t.metricNextFoot}</div></div>
      </div>

      <div className="dash-filter" role="group" aria-label={t.filterLabel}>
        <span className="dash-filter-label">{t.filterLabel} :</span>
        <button className={`dash-filter-pill ${filter === null ? "active" : ""}`} onClick={() => setFilter(null)}>{t.filterAll}</button>
        {activeFamily.children.map((child) => <button key={child.id} className={`dash-filter-pill ${filter === child.id ? "active" : ""}`} onClick={() => setFilter(child.id)}>{child.displayName}</button>)}
      </div>

      <div className="dashboard-grid">
        <div>
          <section className="panel-card">
            <h3>{t.progressTitle}</h3>
            {activeFamily.children
              .map((child, index) => ({ child, subjects: subjectsForIndex(index) }))
              .filter(({ child }) => visibleChildIds.includes(child.id))
              .map(({ child, subjects }) => {
              const pct = computeProgress(subjects);
              return <div className="child-progress-card" key={child.id}>
                <div className="avatar child-avatar">{child.displayName[0]?.toUpperCase()}</div>
                <div className="child-progress-info">
                  <div className="task-title">{child.displayName}</div>
                  <div className="task-meta">{t.ageBandLabels[child.ageBand] ?? child.ageBand}{child.level ? ` · ${child.level}` : ""}</div>
                  <ul className="subject-checklist">{subjects.map((subject) => <li key={subject.key} className={subject.done ? "done" : ""}><span>{subject.done ? "✓" : "○"}</span>{t.subjectNames[subject.key]}</li>)}</ul>
                </div>
                <div className="progress-ring" style={{ "--pct": String(pct * 3.6) } as CssVars}><div className="progress-ring-hole">{pct}%<span>{t.complete}</span></div></div>
              </div>;
            })}
          </section>

          <section className="panel-card">
            <h3>{t.activityTitle}</h3>
            {visibleActivity.map((item) => {
              const [title, meta] = t.activityText[item.id](item.childId ? childNameById[item.childId] ?? "" : "");
              return <div className="task-row" key={item.id}><div><div className="task-title">{title}</div><div className="task-meta">{meta}</div></div><span className="activity-icon">{item.icon}</span></div>;
            })}
          </section>
        </div>

        <div>
          <section className="panel-card">
            <h3>{t.actionsTitle}</h3>
            {visibleTasks.map((task) => {
              const taskCopy = t.tasks[task.id];
              const childName = task.childId ? childNameById[task.childId] ?? "" : "";
              return <div className="task-row" key={task.id}>
                <div><div className="task-title">{taskCopy.title}</div><div className="task-meta">{taskCopy.meta(childName)}</div></div>
                {task.status === "done"
                  ? <span className="tag tag-done">✓ {taskCopy.done}</span>
                  : <button className="real-button real-button-outline task-open" onClick={() => setOpenTaskId(task.id)}>{taskCopy.cta}</button>}
              </div>;
            })}
          </section>

          {fractionsTask?.status === "pending" && <section className="panel-card alert-card">
            <div className="alert-icon">!</div>
            <div><h3>{t.alertTitle}</h3><p>{t.alertText(childNameById[fractionsTask.childId ?? ""] ?? "")}</p></div>
            <button className="real-button real-button-outline" onClick={() => setOpenTaskId("fractions-review")}>{t.alertCta}</button>
          </section>}

          <section className="panel-card">
            <h3>{t.upcomingTitle}</h3>
            <div className="mini-calendar">
              <div className="mini-calendar-label">{month.label}</div>
              <div className="mini-calendar-grid">
                {weekdayLabels.map((day) => <span key={day} className="mini-calendar-weekday">{day}</span>)}
                {month.cells.map((cell, index) => <span key={index} className={`mini-calendar-day ${cell.isToday ? "today" : ""} ${cell.day ? "" : "empty"}`}>{cell.day ?? ""}</span>)}
              </div>
            </div>
            {visibleUpcoming.map((item) => {
              const [title, meta] = t.upcomingText[item.id](item.childId ? childNameById[item.childId] ?? "" : "");
              return <div className="task-row" key={item.id}><div><div className="task-title">{title}</div><div className="task-meta">{meta}</div></div></div>;
            })}
            <a className="real-text-link" href="#">{t.weekPlanCta}</a>
          </section>
        </div>
      </div>
    </section>

    {openTask && openTaskCopy && <div className="task-modal-backdrop" role="dialog" aria-modal="true" onClick={() => setOpenTaskId(null)}>
      <div className="task-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{openTaskCopy.title}</h3>
        <p>{openTaskCopy.detail(openTaskChildName)}</p>
        <div className="task-modal-actions">
          <button className="real-button real-button-outline" onClick={() => setOpenTaskId(null)}>{t.close}</button>
          <button className="real-button real-button-dark" onClick={() => { setTasks((current) => markTaskDone(current, openTask.id)); setOpenTaskId(null); }}>{openTaskCopy.confirm}</button>
        </div>
      </div>
    </div>}
  </main>;
}
