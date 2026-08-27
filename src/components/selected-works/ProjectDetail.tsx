import type { ProjectDetail as ProjectDetailData } from "../../data/portfolio";
import { ProjectGallery } from "./ProjectGallery";
export function ProjectDetail({ detail }: { detail: ProjectDetailData }) { return <div className="project-detail__content"><p className="project-detail__copy">{detail.description}</p><ProjectGallery images={detail.images} /><ul className="project-detail__tags">{detail.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></div>; }
