import { projects } from "../../data/portfolio";
import { StackProject } from "./StackProject";
import { StackStage } from "./StackStage";

export function SelectedWorks() {
  return <section id="selected-works" className="selected-works" aria-labelledby="selected-works-title">
    <header className="selected-works__header"><p className="selected-works__eyebrow">[ SELECTED WORKS / 2026 ]</p><h2 id="selected-works-title">Избранные<br />работы.</h2><p>Четыре истории о путешествиях, культуре, печати и визуальном ритме.</p></header>
    <StackStage>{projects.map((project) => <StackProject key={project.className} className={project.className} index={project.index} labelledBy={`project-${project.className.replace("project--", "")}-title`} detail={project.detail}>
      <div className="project__number">{String(project.index + 1).padStart(2, "0")}</div>
      <div className="project__metadata"><p className="project__type">{project.type}</p><h3 id={`project-${project.className.replace("project--", "")}-title`}>{project.title.map((line) => <span key={line}>{line}<br /></span>)}</h3>{project.description && <p>{project.description}</p>}</div>
      <figure className="project__image"><img src={project.image} alt={project.imageAlt} /></figure>
    </StackProject>)}</StackStage>
  </section>;
}
