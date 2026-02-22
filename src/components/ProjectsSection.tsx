import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github, Folder } from "lucide-react";
import { useProjects, type Project } from "@/hooks/usePortfolioData";
import AuraGlow from "@/components/AuraGlow";

const glowColors = [
  "160, 70%, 45%",
  "40, 90%, 55%",
  "330, 75%, 55%",
  "175, 65%, 40%",
];

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <AuraGlow
        glowColor={glowColors[index % glowColors.length]}
        className="glass rounded-2xl p-6 group transition-all duration-500 flex flex-col h-full cursor-default"
      >
        <div className="flex items-center justify-between mb-4">
          <Folder className="w-9 h-9 text-primary/70" />
          <div className="flex gap-3">
            <a href={project.github_url} className="text-muted-foreground hover:text-primary transition-colors relative z-20">
              <Github className="w-4 h-4" />
            </a>
            <a href={project.live_url} className="text-muted-foreground hover:text-secondary transition-colors relative z-20">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {(project.tags || []).map((tag) => (
            <span key={tag} className="tag-glow text-xs font-mono text-primary/80 px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </AuraGlow>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { data: projects } = useProjects();

  return (
    <section id="projects" className="relative py-32" ref={ref}>
      <div className="section-divider max-w-xl mx-auto mb-32" />
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-mono text-xs mb-3 tracking-[0.2em] uppercase">03 — Projects</p>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
            Featured <span className="gradient-text">Work</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {(projects || []).map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
