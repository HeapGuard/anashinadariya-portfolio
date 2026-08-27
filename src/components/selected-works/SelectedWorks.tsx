import { projects } from "../../data/portfolio";
import { StackProject } from "./StackProject";
import { StackStage } from "./StackStage";
import { ProjectPreview } from "./ProjectPreview";

export function SelectedWorks() {
  return <section id="selected-works" className="selected-works" aria-labelledby="selected-works-title">
    <header className="selected-works__header"><p className="selected-works__eyebrow">[ SELECTED WORKS / 2026 ]</p><h2 id="selected-works-title">Избранные<br />работы.</h2><p>Четыре истории о путешествиях, культуре, печати и визуальном ритме.</p></header>
    <StackStage>{projects.map((project) => <StackProject key={project.className} className={project.className} index={project.index} labelledBy={`project-${project.className.replace("project--", "")}-title`} detail={project.detail}>
      <ProjectPreview project={project} />
    </StackProject>)}</StackStage>
  </section>;
}
