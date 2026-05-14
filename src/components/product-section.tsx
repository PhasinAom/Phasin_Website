import { FeatureCarousel } from "@/components/ui/feature-carousel";

export function ProductSection() {
  return (
    <section className="bg-black py-16">
      <div className="flex justify-center mb-10">
        <h2
          className="text-center font-medium leading-[0.85] tracking-[-0.07em] text-[8vw]"
          style={{ color: "#E1E0CC" }}
        >
          Things That I Build
        </h2>
      </div>
      <FeatureCarousel />
    </section>
  );
}
