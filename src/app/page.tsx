import { Hero } from "@/components/hero";
import { LampDemo } from "@/components/ui/lamp";
import { ProjectsSection } from "@/components/projects-section";
import { ProductSection } from "@/components/product-section";
import { TechStackSection } from "@/components/tech-stack-section";
import { TextColorSplit } from "@/components/ui/text-color-split";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { FooterSection } from "@/components/footer-section";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <div className="p-2 sm:p-3 md:p-4 bg-black">
        <Hero />
      </div>
      <LampDemo />
      <ProjectsSection />
      <div id="projects">
        <ProductSection />
      </div>
      <TechStackSection />
      <TextColorSplit />
      <div id="about">
        <AboutSection />
      </div>
      <div id="contact">
        <ContactSection />
      </div>
      <FooterSection />
    </main>
  );
}
