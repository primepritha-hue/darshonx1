import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github, Folder } from "lucide-react";
import { useProjects, type Project } from "@/hooks/usePortfolioData";
import AuraGlow from "@/components/AuraGlow";

const glowColors = [
  "190, 95%, 55%",
  "260, 60%, 55%",
  "320, 70%, 55%",
  "45, 100%, 60%",
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
          <Folder className="w-10 h-10 text-primary" />
          <div className="flex gap-3">
            <a href={project.github_url} className="text-muted-foreground hover:text-primary transition-colors relative z-20">
              <Github className="w-5 h-5" />
            </a>
            <a href={project.live_url} className="text-muted-foreground hover:text-primary transition-colors relative z-20">
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>

        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {(project.tags || []).map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono text-primary/80 bg-primary/5 border border-primary/10 px-3 py-1 rounded-full"
            >
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
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-mono text-sm mb-2">03. Projects</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
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
