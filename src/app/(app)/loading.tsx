import { Zap } from "lucide-react";

export default function AppLoading() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#00F0FF]/20 to-[#8B5CF6]/20">
          <Zap className="h-6 w-6 animate-pulse text-[#00F0FF]" />
        </div>
        <div className="h-1 w-32 overflow-hidden rounded-full bg-[#1E1E2E]">
          <div className="h-full w-1/2 animate-[shimmer_1.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6]" />
        </div>
      </div>
    </div>
  );
}
