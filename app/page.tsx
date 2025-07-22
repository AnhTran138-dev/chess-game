import { ChessGame } from "@/components/chess-game";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 bg-[url('/light-rays.png')] bg-cover bg-center bg-no-repeat">
      <ChessGame />
    </main>
  );
}
