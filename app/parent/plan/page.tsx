"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  completeActivity,
  createActivity,
  moveActivity,
  validateActivity,
  type LearningActivity,
} from "@/src/domain/learning-activity";
import { visibleForChild } from "@/src/domain/parent-dashboard";
import {
  fallbackFamily,
  readStoredFamily,
  readStoredLocale,
  writeStoredLocale,
  type Locale,
  type StoredFamily,
} from "@/src/lib/family-store";

type SubjectKey = "french" | "math" | "social" | "science" | "class";
type NewActivityDraft = { title: string; childId: string; subjectKey: SubjectKey; day: number; minutes: string };

const dayCount = 5;
const subjectKeys: SubjectKey[] = ["french", "math", "social", "science", "class"];
const subjectIcons: Record<SubjectKey, string> = { french: "A", math: "∑", social: "U", science: "⌁", class: "◌" };
const seedTitleKeys = new Set(["seed-fractions", "seed-opinion", "seed-ai-quiz", "seed-pod"]);
const wholeFamilyValue = "__family__";

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

function seedActivities(family: StoredFamily): LearningActivity[] {
  const c0 = family.children[0].id;
  const c1 = family.children[1]?.id ?? c0;
  return [
    { id: "seed-a1", childId: c0, title: "seed-fractions", subjectKey: "math", day: 0, minutes: 25, status: "planned", aiGenerated: false },
    { id: "seed-a2", childId: c1, title: "seed-opinion", subjectKey: "french", day: 1, minutes: 30, status: "done", aiGenerated: false },
    { id: "seed-a3", childId: c0, title: "seed-ai-quiz", subjectKey: "science", day: 2, minutes: 20, status: "needs_review", aiGenerated: true },
    { id: "seed-a4", childId: null, title: "seed-pod", subjectKey: "class", day: 3, minutes: 60, status: "planned", aiGenerated: false },
  ];
}

function getWeekDates(): Date[] {
  const now = new Date();
  const dow = now.getDay();
  const diffToMonday = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);
  return Array.from({ length: dayCount }, (_, i) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i));
}

const copy = {
  fr: {
    sidebarLabel: "Famille",
    sidebarLinks: { home: "Accueil", weekPlan: "Plan de la semaine", courses: "Cours", assistant: "Assistant IA", community: "Communauté", portfolio: "Portfolio", quebecPath: "Parcours Québec", budget: "Budget" },
    sidebarBottom: "Votre espace reste privé. Les contenus générés par l’IA nécessitent votre validation.",
    eyebrow: "Espace parent", title: "Plan de la semaine",
    lead: "Organisez les activités de la semaine, déplacez-les au besoin et validez ce que l’IA a préparé.",
    filterLabel: "Afficher", filterAll: "Toute la famille",
    addActivity: "+ Ajouter une activité",
    wholeFamily: "Toute la famille",
    subjectNames: { french: "Français", math: "Mathématiques", social: "Univers social", science: "Sciences", class: "Classe collaborative" } as Record<SubjectKey, string>,
    seedTitles: { "seed-fractions": "Fractions – exercices", "seed-opinion": "Texte d’opinion", "seed-ai-quiz": "Quiz de sciences (généré par l’IA)", "seed-pod": "Classe collaborative · Sciences" } as Record<string, string>,
    aiTag: "IA",
    statusDone: "Terminé", statusValidated: "Validé",
    complete: "Terminer", validate: "Valider",
    moveEarlier: "Déplacer au jour précédent", moveLater: "Déplacer au jour suivant",
    minutesLabel: (m: number) => `${m} min`,
    emptyDay: "Aucune activité",
    modalTitle: "Nouvelle activité",
    fieldTitle: "Titre", fieldTitlePlaceholder: "Ex. Révision de vocabulaire",
    fieldChild: "Enfant", fieldSubject: "Matière", fieldDay: "Jour", fieldMinutes: "Durée (minutes)",
    create: "Créer l’activité", cancel: "Annuler",
    errorTitle: "Le titre est requis.",
    errorMinutes: "La durée doit être un nombre positif.",
  },
  en: {
    sidebarLabel: "Family",
    sidebarLinks: { home: "Home", weekPlan: "Week plan", courses: "Courses", assistant: "AI assistant", community: "Community", portfolio: "Portfolio", quebecPath: "Quebec pathway", budget: "Budget" },
    sidebarBottom: "Your space stays private. AI-generated content needs your review.",
    eyebrow: "Parent space", title: "Week plan",
    lead: "Organize the week's activities, move them around as needed, and review what the AI prepared.",
    filterLabel: "Show", filterAll: "Whole family",
    addActivity: "+ Add an activity",
    wholeFamily: "Whole family",
    subjectNames: { french: "French", math: "Math", social: "Social studies", science: "Science", class: "Collaborative class" } as Record<SubjectKey, string>,
    seedTitles: { "seed-fractions": "Fractions – practice", "seed-opinion": "Opinion text", "seed-ai-quiz": "Science quiz (AI-generated)", "seed-pod": "Collaborative class · Science" } as Record<string, string>,
    aiTag: "AI",
    statusDone: "Done", statusValidated: "Validated",
    complete: "Complete", validate: "Validate",
    moveEarlier: "Move to the previous day", moveLater: "Move to the next day",
    minutesLabel: (m: number) => `${m} min`,
    emptyDay: "No activity",
    modalTitle: "New activity",
    fieldTitle: "Title", fieldTitlePlaceholder: "E.g. Vocabulary review",
    fieldChild: "Child", fieldSubject: "Subject", fieldDay: "Day", fieldMinutes: "Duration (minutes)",
    create: "Create the activity", cancel: "Cancel",
    errorTitle: "Title is required.",
    errorMinutes: "Duration must be a positive number.",
  },
} as const;

export default function WeekPlanPage() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [hydrated, setHydrated] = useState(false);
  const [family, setFamily] = useState<StoredFamily | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [activities, setActivities] = useState<LearningActivity[]>(() => seedActivities(fallbackFamily("fr")));
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = readStoredLocale();
    if (saved) setLocale(saved);

    const loaded = readStoredFamily();
    if (loaded) {
      setFamily(loaded);
      setActivities(seedActivities(loaded));
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeStoredLocale(locale);
  }, [locale, hydrated]);

  const t = copy[locale];
  const activeFamily = family ?? fallbackFamily(locale);
  const childNameById = Object.fromEntries(activeFamily.children.map((child) => [child.id, child.displayName]));
  const weekDates = useMemo(() => getWeekDates(), []);
  const dayLabels = weekDates.map((d) => d.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "short" }));

  const visibleActivities = visibleForChild(activities, filter);

  const [draft, setDraft] = useState<NewActivityDraft>({ title: "", childId: wholeFamilyValue, subjectKey: "math", day: 0, minutes: "30" });

  function activityTitle(activity: LearningActivity): string {
    return seedTitleKeys.has(activity.title) ? t.seedTitles[activity.title] ?? activity.title : activity.title;
  }

  function openCreate() {
    setDraft({ title: "", childId: wholeFamilyValue, subjectKey: "math", day: 0, minutes: "30" });
    setError("");
    setShowCreate(true);
  }

  function submitCreate() {
    const minutes = Number(draft.minutes);
    if (!draft.title.trim()) return setError(t.errorTitle);
    if (!Number.isFinite(minutes) || minutes <= 0) return setError(t.errorMinutes);
    const activity = createActivity({
      id: crypto.randomUUID(),
      childId: draft.childId === wholeFamilyValue ? null : draft.childId,
      title: draft.title,
      subjectKey: draft.subjectKey,
      day: draft.day,
      minutes,
    });
    setActivities((current) => [...current, activity]);
    setShowCreate(false);
  }

  return <main className="app-shell">
    <aside className="sidebar">
      <Link className="brand" href="/"><img className="sidebar-logo-image" src="/ui/logo-madrasa-quebec.png" alt="Madrasa Québec Network" /></Link>
      <div className="side-label">{t.sidebarLabel}</div>
      {sidebarLinks.map(([icon, key, href]) => <Link key={key} className={`side-link ${href === "/parent/plan" ? "active" : ""}`} href={href}><span>{icon}</span><span>{t.sidebarLinks[key as keyof typeof t.sidebarLinks]}</span></Link>)}
      <div className="real-language-switch sidebar-lang" aria-label={locale === "fr" ? "Choisir la langue" : "Choose language"}>
        <button className={locale === "fr" ? "active" : ""} onClick={() => setLocale("fr")} aria-pressed={locale === "fr"}>FR</button>
        <button className={locale === "en" ? "active" : ""} onClick={() => setLocale("en")} aria-pressed={locale === "en"}>EN</button>
      </div>
      <div className="sidebar-bottom">{t.sidebarBottom}</div>
    </aside>

    <section className="workspace">
      <div className="workspace-top">
        <div><div className="eyebrow">{t.eyebrow}</div><h1>{t.title}</h1></div>
        <button className="real-button real-button-dark" onClick={openCreate}>{t.addActivity}</button>
      </div>
      <p className="plan-lead">{t.lead}</p>

      <div className="dash-filter" role="group" aria-label={t.filterLabel}>
        <span className="dash-filter-label">{t.filterLabel} :</span>
        <button className={`dash-filter-pill ${filter === null ? "active" : ""}`} onClick={() => setFilter(null)}>{t.filterAll}</button>
        {activeFamily.children.map((child) => <button key={child.id} className={`dash-filter-pill ${filter === child.id ? "active" : ""}`} onClick={() => setFilter(child.id)}>{child.displayName}</button>)}
      </div>

      <div className="week-grid">
        {dayLabels.map((label, day) => <div className="week-day-column" key={day}>
          <div className="week-day-header">{label}</div>
          {visibleActivities.filter((activity) => activity.day === day).length === 0 && <p className="week-day-empty">{t.emptyDay}</p>}
          {visibleActivities.filter((activity) => activity.day === day).map((activity) => <div className="activity-card" key={activity.id}>
            <div className="activity-card-top">
              <span className="subject-icon activity-subject-icon">{subjectIcons[activity.subjectKey as SubjectKey]}</span>
              <div>
                <div className="task-title">{activityTitle(activity)}{activity.aiGenerated && <span className="ai-badge">{t.aiTag}</span>}</div>
                <div className="task-meta">{t.subjectNames[activity.subjectKey as SubjectKey]} · {t.minutesLabel(activity.minutes)}{activity.childId ? ` · ${childNameById[activity.childId] ?? ""}` : ` · ${t.wholeFamily}`}</div>
              </div>
            </div>
            <div className="activity-card-actions">
              <div className="activity-move">
                <button type="button" aria-label={t.moveEarlier} disabled={day === 0} onClick={() => setActivities((current) => moveActivity(current, activity.id, day - 1))}>‹</button>
                <button type="button" aria-label={t.moveLater} disabled={day === dayCount - 1} onClick={() => setActivities((current) => moveActivity(current, activity.id, day + 1))}>›</button>
              </div>
              {activity.status === "planned" && <button type="button" className="real-button real-button-outline task-open" onClick={() => setActivities((current) => completeActivity(current, activity.id))}>{t.complete}</button>}
              {activity.status === "needs_review" && <button type="button" className="real-button real-button-outline task-open" onClick={() => setActivities((current) => validateActivity(current, activity.id))}>{t.validate}</button>}
              {activity.status === "done" && <span className="tag tag-done">✓ {t.statusDone}</span>}
              {activity.status === "validated" && <span className="tag tag-done">✓ {t.statusValidated}</span>}
            </div>
          </div>)}
        </div>)}
      </div>
    </section>

    {showCreate && <div className="task-modal-backdrop" role="dialog" aria-modal="true" onClick={() => setShowCreate(false)}>
      <div className="task-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{t.modalTitle}</h3>
        <div className="onboarding-fields plan-create-fields">
          <label>{t.fieldTitle}<input value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} placeholder={t.fieldTitlePlaceholder} /></label>
          <label>{t.fieldChild}<select value={draft.childId} onChange={(e) => setDraft((d) => ({ ...d, childId: e.target.value }))}>
            <option value={wholeFamilyValue}>{t.wholeFamily}</option>
            {activeFamily.children.map((child) => <option key={child.id} value={child.id}>{child.displayName}</option>)}
          </select></label>
          <label>{t.fieldSubject}<select value={draft.subjectKey} onChange={(e) => setDraft((d) => ({ ...d, subjectKey: e.target.value as SubjectKey }))}>
            {subjectKeys.map((key) => <option key={key} value={key}>{t.subjectNames[key]}</option>)}
          </select></label>
          <label>{t.fieldDay}<select value={draft.day} onChange={(e) => setDraft((d) => ({ ...d, day: Number(e.target.value) }))}>
            {dayLabels.map((label, index) => <option key={index} value={index}>{label}</option>)}
          </select></label>
          <label>{t.fieldMinutes}<input type="number" min={1} value={draft.minutes} onChange={(e) => setDraft((d) => ({ ...d, minutes: e.target.value }))} /></label>
        </div>
        {error && <p className="onboarding-error" role="alert">{error}</p>}
        <div className="task-modal-actions">
          <button className="real-button real-button-outline" onClick={() => setShowCreate(false)}>{t.cancel}</button>
          <button className="real-button real-button-dark" onClick={submitCreate}>{t.create}</button>
        </div>
      </div>
    </div>}
  </main>;
}
