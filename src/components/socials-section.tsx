import AppIcons from "@/components/ui/app-icons";

export function SocialsSection() {
  return (
    <section className="bg-black flex flex-col items-center justify-center py-24 gap-6">
      <p
        className="text-xs uppercase tracking-[0.3em]"
        style={{ color: "rgba(225,224,204,0.3)" }}
      >
        Find me on
      </p>
      <AppIcons />
    </section>
  );
}
