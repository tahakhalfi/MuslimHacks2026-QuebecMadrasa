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

type Locale = "fr" | "en";
type ChildId = "adam" | "sara";
type CssVars = React.CSSProperties & { "--pct"?: string };

const localeStorageKey = "madrasa-locale";
const childIds: ChildId[] = ["adam", "sara"];
const subjectKeys = ["french", "math", "social", "science"] as const;

const sidebarLinks = [
  ["⌂", "home", "/parent"],
  ["☷", "weekPlan", "#"],
  ["▣", "courses", "#"],
  ["✦", "assistant", "#"],
  ["◌", "community", "#"],
  ["▤", "portfolio", "#"],
  ["◫", "quebecPath", "#"],
  ["$", "budget", "#"],
] as const;

const subjectsByChild: Record<ChildId, { key: (typeof subjectKeys)[number]; done: boolean }[]> = {
  adam: [
    { key: "french", done: true },
    { key: "math", done: true },
    { key: "social", done: false },
    { key: "science", done: true },
  ],
  sara: [
    { key: "french", done: true },
    { key: "math", done: true },
    { key: "social", done: false },
    { key: "science", done: false },
  ],
};

const initialTasks: ParentTask[] = [
  { id: "fractions-review", childId: "adam", status: "pending", dueAt: "2026-09-12" },
  { id: "portfolio-evidence", childId: "sara", status: "pending" },
  { id: "pod-booking", childId: null, status: "pending" },
];

const activityItems: { id: string; childId: ChildId | null; icon: string }[] = [
  { id: "adam-opinion", childId: "adam", icon: "▤" },
  { id: "sara-solids", childId: "sara", icon: "✓" },
  { id: "pod-confirmed", childId: null, icon: "◌" },
  { id: "adam-portfolio", childId: "adam", icon: "▤" },
];

const upcomingItems: { id: string; childId: ChildId | null }[] = [
  { id: "pod-thursday", childId: null },
  { id: "fractions-due", childId: "adam" },
];

const copy = {
  fr: {
    sidebarLabel: "Famille",
    sidebarLinks: { home: "Accueil", weekPlan: "Plan de la semaine", courses: "Cours", assistant: "Assistant IA", community: "Communauté", portfolio: "Portfolio", quebecPath: "Parcours Québec", budget: "Budget" },
    sidebarBottom: "Votre espace reste privé. Les contenus générés par l’IA nécessitent votre validation.",
    eyebrow: "Espace parent · semaine du 7 septembre",
    hello: "Bonjour, Amine",
    heroLabel: "Votre prochain geste",
    heroTitle: "Préparer le projet d’apprentissage.",
    heroText: "Il reste des éléments à vérifier avant de générer votre brouillon pour le parcours Québec.",
    heroCta: "Continuer",
    metricProgress: "Progression familiale", metricTasks: "Tâches à valider", metricNext: "Prochaine échéance",
    metricProgressFoot: "Moyenne des deux enfants", metricTasksFoot: "contenu(s) ou action(s) en attente", metricNextFoot: "Leçon de fractions à valider",
    filterLabel: "Afficher", filterAll: "Toute la famille",
    childNames: { adam: "Adam", sara: "Sara" } as Record<ChildId, string>,
    childMeta: { adam: "10 ans · 5e année", sara: "14 ans · 3e secondaire" } as Record<ChildId, string>,
    subjectNames: { french: "Français", math: "Mathématiques", social: "Univers social", science: "Sciences" } as Record<string, string>,
    progressTitle: "Progression de la semaine", complete: "Complété",
    activityTitle: "Activité récente",
    activityText: {
      "adam-opinion": ["Adam a soumis son texte d’opinion.", "Français · 5e année"],
      "sara-solids": ["Sara a complété la leçon sur les solides.", "Mathématiques · 3e secondaire"],
      "pod-confirmed": ["Séance de pod confirmée pour jeudi.", "Groupe 3e année · 16 h 30"],
      "adam-portfolio": ["Nouveau document ajouté au portfolio d’Adam.", "Projet · Le système solaire"],
    } as Record<string, [string, string]>,
    actionsTitle: "Prochaines actions",
    tasks: {
      "fractions-review": { title: "Valider le cours de fractions", meta: "Généré pour Adam · 25 min", cta: "Ouvrir", tag: "À valider", done: "Validé",
        detail: "Un cours de révision sur les fractions a été généré pour Adam. Vérifiez le contenu avant de l’ajouter à son parcours.", confirm: "Marquer comme validé" },
      "portfolio-evidence": { title: "Ajouter une preuve au portfolio", meta: "Sara · Sciences et technologie", cta: "Ajouter", tag: "Cette semaine", done: "Ajoutée",
        detail: "Ajoutez une preuve (photo, document ou lien) au portfolio de Sara pour son projet de sciences.", confirm: "Marquer comme ajoutée" },
      "pod-booking": { title: "Choisir une classe collaborative", meta: "Jeudi · 16 h 30 · 6 places", cta: "Réserver", tag: "Réserver", done: "Confirmé",
        detail: "Confirmez la place de votre famille pour la classe collaborative de jeudi 16 h 30 (Sciences, 6 places disponibles).", confirm: "Confirmer la réservation" },
    } as Record<string, { title: string; meta: string; cta: string; tag: string; done: string; detail: string; confirm: string }>,
    alertTitle: "Échéance à vérifier", alertCta: "Voir les détails",
    alertText: "La leçon de fractions d’Adam est à valider avant le 12 septembre.",
    upcomingTitle: "À venir", weekPlanCta: "Voir le plan de la semaine →",
    upcomingText: {
      "pod-thursday": ["Séance de pod · 3e année", "Jeudi · 16 h 00"],
      "fractions-due": ["Échéance : leçon de fractions", "12 sept. · Adam"],
    } as Record<string, [string, string]>,
    close: "Fermer",
  },
  en: {
    sidebarLabel: "Family",
    sidebarLinks: { home: "Home", weekPlan: "Week plan", courses: "Courses", assistant: "AI assistant", community: "Community", portfolio: "Portfolio", quebecPath: "Quebec pathway", budget: "Budget" },
    sidebarBottom: "Your space stays private. AI-generated content needs your review.",
    eyebrow: "Parent space · week of September 7",
    hello: "Hello, Amine",
    heroLabel: "Your next step",
    heroTitle: "Prepare the learning project.",
    heroText: "A few things are left to check before generating your Quebec pathway draft.",
    heroCta: "Continue",
    metricProgress: "Family progress", metricTasks: "Tasks to review", metricNext: "Next deadline",
    metricProgressFoot: "Average of both children", metricTasksFoot: "item(s) or action(s) pending", metricNextFoot: "Fractions lesson to review",
    filterLabel: "Show", filterAll: "Whole family",
    childNames: { adam: "Adam", sara: "Sara" } as Record<ChildId, string>,
    childMeta: { adam: "10 years old · Grade 5", sara: "14 years old · Grade 9" } as Record<ChildId, string>,
    subjectNames: { french: "French", math: "Math", social: "Social studies", science: "Science" } as Record<string, string>,
    progressTitle: "This week's progress", complete: "Complete",
    activityTitle: "Recent activity",
    activityText: {
      "adam-opinion": ["Adam submitted his opinion text.", "French · Grade 5"],
      "sara-solids": ["Sara completed the lesson on solids.", "Math · Grade 9"],
      "pod-confirmed": ["Pod session confirmed for Thursday.", "Grade 9 group · 4:30 PM"],
      "adam-portfolio": ["New document added to Adam's portfolio.", "Project · The solar system"],
    } as Record<string, [string, string]>,
    actionsTitle: "Next actions",
    tasks: {
      "fractions-review": { title: "Review the fractions lesson", meta: "Generated for Adam · 25 min", cta: "Open", tag: "To review", done: "Reviewed",
        detail: "A review lesson on fractions was generated for Adam. Check the content before adding it to his path.", confirm: "Mark as reviewed" },
      "portfolio-evidence": { title: "Add a portfolio proof", meta: "Sara · Science and technology", cta: "Add", tag: "This week", done: "Added",
        detail: "Add a proof (photo, document or link) to Sara's portfolio for her science project.", confirm: "Mark as added" },
      "pod-booking": { title: "Choose a collaborative class", meta: "Thursday · 4:30 PM · 6 spots", cta: "Book", tag: "Book", done: "Confirmed",
        detail: "Confirm your family's spot for Thursday's collaborative class (Science, 6 spots available).", confirm: "Confirm the booking" },
    } as Record<string, { title: string; meta: string; cta: string; tag: string; done: string; detail: string; confirm: string }>,
    alertTitle: "Deadline to review", alertCta: "See details",
    alertText: "Adam's fractions lesson needs review before September 12.",
    upcomingTitle: "Coming up", weekPlanCta: "View the week plan →",
    upcomingText: {
      "pod-thursday": ["Pod session · Grade 9", "Thursday · 4:00 PM"],
      "fractions-due": ["Due: fractions lesson", "Sep 12 · Adam"],
    } as Record<string, [string, string]>,
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
  const [filter, setFilter] = useState<ChildId | null>(null);
  const [tasks, setTasks] = useState<ParentTask[]>(initialTasks);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(localeStorageKey);
    if (saved === "fr" || saved === "en") setLocale(saved);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(localeStorageKey, locale);
  }, [locale, hydrated]);

  const t = copy[locale];
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
  const familyProgress = Math.round(childIds.reduce((sum, id) => sum + computeProgress(subjectsByChild[id]), 0) / childIds.length);
  const openTask = openTaskId ? tasks.find((task) => task.id === openTaskId) : undefined;
  const openTaskCopy = openTask ? t.tasks[openTask.id] : undefined;

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
        <div><div className="eyebrow">{t.eyebrow}</div><h1>{t.hello}</h1></div>
        <div className="profile"><span className="avatar">AG</span><span>Famille Ghorbel⌄</span></div>
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
        {childIds.map((id) => <button key={id} className={`dash-filter-pill ${filter === id ? "active" : ""}`} onClick={() => setFilter(id)}>{t.childNames[id]}</button>)}
      </div>

      <div className="dashboard-grid">
        <div>
          <section className="panel-card">
            <h3>{t.progressTitle}</h3>
            {visibleChildIds.map((id) => {
              const subjects = subjectsByChild[id];
              const pct = computeProgress(subjects);
              return <div className="child-progress-card" key={id}>
                <div className="avatar child-avatar">{t.childNames[id][0]}</div>
                <div className="child-progress-info">
                  <div className="task-title">{t.childNames[id]}</div>
                  <div className="task-meta">{t.childMeta[id]}</div>
                  <ul className="subject-checklist">{subjects.map((subject) => <li key={subject.key} className={subject.done ? "done" : ""}><span>{subject.done ? "✓" : "○"}</span>{t.subjectNames[subject.key]}</li>)}</ul>
                </div>
                <div className="progress-ring" style={{ "--pct": String(pct * 3.6) } as CssVars}><div className="progress-ring-hole">{pct}%<span>{t.complete}</span></div></div>
              </div>;
            })}
          </section>

          <section className="panel-card">
            <h3>{t.activityTitle}</h3>
            {visibleActivity.map((item) => <div className="task-row" key={item.id}><div><div className="task-title">{t.activityText[item.id][0]}</div><div className="task-meta">{t.activityText[item.id][1]}</div></div><span className="activity-icon">{item.icon}</span></div>)}
          </section>
        </div>

        <div>
          <section className="panel-card">
            <h3>{t.actionsTitle}</h3>
            {visibleTasks.map((task) => {
              const taskCopy = t.tasks[task.id];
              return <div className="task-row" key={task.id}>
                <div><div className="task-title">{taskCopy.title}</div><div className="task-meta">{taskCopy.meta}</div></div>
                {task.status === "done"
                  ? <span className="tag tag-done">✓ {taskCopy.done}</span>
                  : <button className="real-button real-button-outline task-open" onClick={() => setOpenTaskId(task.id)}>{taskCopy.cta}</button>}
              </div>;
            })}
          </section>

          {tasks.some((task) => task.id === "fractions-review" && task.status === "pending") && <section className="panel-card alert-card">
            <div className="alert-icon">!</div>
            <div><h3>{t.alertTitle}</h3><p>{t.alertText}</p></div>
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
            {visibleUpcoming.map((item) => <div className="task-row" key={item.id}><div><div className="task-title">{t.upcomingText[item.id][0]}</div><div className="task-meta">{t.upcomingText[item.id][1]}</div></div></div>)}
            <a className="real-text-link" href="#">{t.weekPlanCta}</a>
          </section>
        </div>
      </div>
    </section>

    {openTask && openTaskCopy && <div className="task-modal-backdrop" role="dialog" aria-modal="true" onClick={() => setOpenTaskId(null)}>
      <div className="task-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{openTaskCopy.title}</h3>
        <p>{openTaskCopy.detail}</p>
        <div className="task-modal-actions">
          <button className="real-button real-button-outline" onClick={() => setOpenTaskId(null)}>{t.close}</button>
          <button className="real-button real-button-dark" onClick={() => { setTasks((current) => markTaskDone(current, openTask.id)); setOpenTaskId(null); }}>{openTaskCopy.confirm}</button>
        </div>
      </div>
    </div>}
  </main>;
}
