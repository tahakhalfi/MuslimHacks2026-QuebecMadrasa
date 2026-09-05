"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { requiredConsents, type AgeBand } from "@/src/domain/family";

type Locale = "fr" | "en";
type ChildDraft = { displayName: string; ageBand: AgeBand; level: string };

const localeStorageKey = "madrasa-locale";
const familyStorageKey = "madrasa-family";
const ageBands: AgeBand[] = ["5-8", "9-12", "13-15", "16-17"];

const copy = {
  fr: {
    title: "Créer votre famille",
    lead: "Trois étapes rapides pour préparer votre espace. Rien n’est partagé publiquement.",
    steps: ["Famille", "Enfants", "Consentement"],
    parentName: "Votre prénom", parentNamePlaceholder: "Ex. Amine",
    familyName: "Nom de la famille", familyNamePlaceholder: "Ex. Famille Ghorbel",
    jurisdiction: "Juridiction", jurisdictionQuebec: "Québec", jurisdictionOther: "Autre (bientôt disponible)",
    schoolYear: "Année scolaire",
    next: "Continuer", back: "Retour", addChild: "Ajouter un enfant", removeChild: "Retirer",
    childName: "Prénom de l’enfant", childNamePlaceholder: "Ex. Adam", ageBand: "Tranche d’âge", level: "Niveau ou année",
    levelPlaceholder: "Ex. 5e année",
    consentTitle: "Avant de continuer",
    consents: [
      ["guardian", "Je confirme être le parent ou le tuteur légal responsable des enfants ajoutés."],
      ["aiReview", "Je comprends que je dois valider tout contenu généré par l’IA avant qu’il rejoigne le parcours de mon enfant."],
      ["quebecLimit", "Je comprends que le module Parcours Québec est un assistant de préparation : il ne certifie pas la conformité et ne remplace pas un avis officiel."],
    ] as [string, string][],
    create: "Créer ma famille", creating: "Création en cours…",
    errorParentName: "Votre prénom est requis.",
    errorName: "Le nom de la famille est requis.",
    errorSchoolYear: "Utilisez le format 2026-2027.",
    errorChildren: "Ajoutez au moins un enfant avec un prénom.",
    errorConsents: "Cochez les trois cases pour continuer.",
    errorServer: "La création a échoué. Vérifiez vos informations et réessayez.",
    successTitle: "Bienvenue, famille !",
    successText: "Votre espace est prêt. Vous pourrez ajouter d’autres enfants et préciser vos préférences depuis le tableau de bord.",
    goDashboard: "Aller à mon tableau de bord",
    backHome: "← Retour à l’accueil",
  },
  en: {
    title: "Create your family",
    lead: "Three quick steps to set up your space. Nothing is shared publicly.",
    steps: ["Family", "Children", "Consent"],
    parentName: "Your first name", parentNamePlaceholder: "E.g. Amine",
    familyName: "Family name", familyNamePlaceholder: "E.g. The Ghorbel family",
    jurisdiction: "Jurisdiction", jurisdictionQuebec: "Quebec", jurisdictionOther: "Other (coming soon)",
    schoolYear: "School year",
    next: "Continue", back: "Back", addChild: "Add a child", removeChild: "Remove",
    childName: "Child's first name", childNamePlaceholder: "E.g. Adam", ageBand: "Age band", level: "Grade or level",
    levelPlaceholder: "E.g. Grade 5",
    consentTitle: "Before you continue",
    consents: [
      ["guardian", "I confirm I am the parent or legal guardian responsible for the children added."],
      ["aiReview", "I understand I must review any AI-generated content before it enters my child's learning path."],
      ["quebecLimit", "I understand the Quebec pathway module is a preparation assistant: it does not certify compliance or replace official advice."],
    ] as [string, string][],
    create: "Create my family", creating: "Creating…",
    errorParentName: "Your first name is required.",
    errorName: "Family name is required.",
    errorSchoolYear: "Use the format 2026-2027.",
    errorChildren: "Add at least one child with a first name.",
    errorConsents: "Check all three boxes to continue.",
    errorServer: "Creation failed. Check your information and try again.",
    successTitle: "Welcome, family!",
    successText: "Your space is ready. You can add more children and fine-tune preferences from the dashboard.",
    goDashboard: "Go to my dashboard",
    backHome: "← Back to home",
  },
} as const;

export default function OnboardingPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("fr");
  const t = copy[locale];

  useEffect(() => {
    const saved = window.localStorage.getItem(localeStorageKey);
    if (saved === "fr" || saved === "en") setLocale(saved);
  }, []);

  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [parentName, setParentName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [schoolYear, setSchoolYear] = useState("2026-2027");
  const [children, setChildren] = useState<ChildDraft[]>([{ displayName: "", ageBand: "5-8", level: "" }]);
  const [consents, setConsents] = useState<string[]>([]);

  function updateChild(index: number, patch: Partial<ChildDraft>) {
    setChildren((current) => current.map((child, i) => (i === index ? { ...child, ...patch } : child)));
  }

  function addChild() {
    setChildren((current) => [...current, { displayName: "", ageBand: "5-8", level: "" }]);
  }

  function removeChild(index: number) {
    setChildren((current) => current.filter((_, i) => i !== index));
  }

  function toggleConsent(id: string) {
    setConsents((current) => (current.includes(id) ? current.filter((c) => c !== id) : [...current, id]));
  }

  function goNext() {
    setError("");
    if (step === 0) {
      if (!parentName.trim()) return setError(t.errorParentName);
      if (!familyName.trim()) return setError(t.errorName);
      if (!/^\d{4}-\d{4}$/.test(schoolYear)) return setError(t.errorSchoolYear);
    }
    if (step === 1) {
      if (children.length === 0 || children.every((child) => !child.displayName.trim())) return setError(t.errorChildren);
    }
    setStep((current) => Math.min(current + 1, 2));
  }

  function goBack() {
    setError("");
    setStep((current) => Math.max(current - 1, 0));
  }

  async function submit() {
    setError("");
    if (requiredConsents.some((id) => !consents.includes(id))) {
      setError(t.errorConsents);
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: familyName,
          parentName,
          locale,
          schoolYear,
          consents,
          children: children.filter((child) => child.displayName.trim()),
        }),
      });
      if (!response.ok) throw new Error("failed");
      const data = await response.json();
      window.localStorage.setItem(familyStorageKey, JSON.stringify({ family: data.family, children: data.children }));
      setDone(true);
    } catch {
      setError(t.errorServer);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return <main className="onboarding-shell">
      <div className="onboarding-card onboarding-success">
        <img className="onboarding-logo" src="/ui/logo-madrasa-quebec.png" alt="Madrasa Québec Network" />
        <div className="onboarding-success-badge">✓</div>
        <h1>{t.successTitle}</h1>
        <p>{t.successText}</p>
        <button className="real-button real-button-dark real-button-large" onClick={() => router.push("/parent")}>{t.goDashboard}</button>
      </div>
    </main>;
  }

  return <main className="onboarding-shell">
    <div className="onboarding-card">
      <Link href="/" className="onboarding-back">{t.backHome}</Link>
      <img className="onboarding-logo" src="/ui/logo-madrasa-quebec.png" alt="Madrasa Québec Network" />
      <h1>{t.title}</h1>
      <p className="onboarding-lead">{t.lead}</p>

      <ol className="onboarding-steps">
        {t.steps.map((label, index) => <li key={label} className={index === step ? "active" : index < step ? "done" : ""}><span>{index + 1}</span>{label}</li>)}
      </ol>

      {step === 0 && <div className="onboarding-fields">
        <label>{t.parentName}<input value={parentName} onChange={(e) => setParentName(e.target.value)} placeholder={t.parentNamePlaceholder} /></label>
        <label>{t.familyName}<input value={familyName} onChange={(e) => setFamilyName(e.target.value)} placeholder={t.familyNamePlaceholder} /></label>
        <label>{t.jurisdiction}<select value="quebec" onChange={() => {}}><option value="quebec">{t.jurisdictionQuebec}</option><option value="other" disabled>{t.jurisdictionOther}</option></select></label>
        <label>{t.schoolYear}<input value={schoolYear} onChange={(e) => setSchoolYear(e.target.value)} placeholder="2026-2027" /></label>
      </div>}

      {step === 1 && <div className="onboarding-fields">
        {children.map((child, index) => <div className="onboarding-child-row" key={index}>
          <label>{t.childName}<input value={child.displayName} onChange={(e) => updateChild(index, { displayName: e.target.value })} placeholder={t.childNamePlaceholder} /></label>
          <label>{t.ageBand}<select value={child.ageBand} onChange={(e) => updateChild(index, { ageBand: e.target.value as AgeBand })}>{ageBands.map((band) => <option key={band} value={band}>{band}</option>)}</select></label>
          <label>{t.level}<input value={child.level} onChange={(e) => updateChild(index, { level: e.target.value })} placeholder={t.levelPlaceholder} /></label>
          {children.length > 1 && <button type="button" className="onboarding-remove-child" onClick={() => removeChild(index)}>{t.removeChild}</button>}
        </div>)}
        <button type="button" className="real-button real-button-outline" onClick={addChild}>+ {t.addChild}</button>
      </div>}

      {step === 2 && <div className="onboarding-fields">
        <p className="onboarding-consent-title">{t.consentTitle}</p>
        {t.consents.map(([id, label]) => <label key={id} className="onboarding-consent-row">
          <input type="checkbox" checked={consents.includes(id)} onChange={() => toggleConsent(id)} />
          <span>{label}</span>
        </label>)}
      </div>}

      {error && <p className="onboarding-error" role="alert">{error}</p>}

      <div className="onboarding-actions">
        {step > 0 && <button type="button" className="real-button real-button-outline" onClick={goBack} disabled={submitting}>{t.back}</button>}
        {step < 2
          ? <button type="button" className="real-button real-button-dark" onClick={goNext}>{t.next}</button>
          : <button type="button" className="real-button real-button-dark" onClick={submit} disabled={submitting}>{submitting ? t.creating : t.create}</button>}
      </div>
    </div>
  </main>;
}
