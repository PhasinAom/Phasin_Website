'use client';

import FlowArt, { FlowSection } from '@/components/ui/story-scroll';
import { projects } from '@/lib/projects';

export function ProjectsSection() {
  return (
    <section aria-label="Selected work">
      <FlowArt aria-label="Project storyboard">
        {projects.map((project) => (
          <FlowSection
            key={project.id}
            aria-label={project.title}
            style={{ backgroundColor: project.bg }}
          >
            {/* Top: index */}
            <div>
              <span
                className="text-xs uppercase tracking-[0.3em]"
                style={{ color: `${project.accent}50` }}
              >
                {String(project.id).padStart(2, '0')} — {project.role.join(' & ')}
              </span>
            </div>

            {/* Middle: title left, image placeholder right */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 flex-1">
              <h3
                className="font-bold leading-[0.85] tracking-[-0.05em] text-[15vw] lg:text-[9vw] shrink-0"
                style={{ color: project.accent }}
              >
                {project.title.split(' ').map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </h3>

              {/* Image */}
              <div
                className="w-full lg:w-auto lg:h-[72vh] aspect-[3/4] rounded-2xl relative overflow-hidden border shrink-0"
                style={{
                  borderColor: `${project.accent}18`,
                  background: `${project.accent}06`,
                }}
              >
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Bottom: description */}
            <p
              className="max-w-2xl text-xl leading-snug md:text-2xl lg:text-3xl"
              style={{ color: `${project.accent}80` }}
            >
              {project.description}
            </p>
          </FlowSection>
        ))}
      </FlowArt>
    </section>
  );
}
