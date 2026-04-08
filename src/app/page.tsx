import WallCalendar from "@/components/Calendar/WallCalendar";

export default function Home() {
  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 md:p-10"
      style={{
        background:
          "radial-gradient(ellipse at 60% 40%, #d6d6d6 0%, #c8c8c8 60%, #bebebe 100%)",
      }}
    >
      <WallCalendar />
    </main>
  );
}