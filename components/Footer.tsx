import { Newspaper } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-neutral-800/50">
      <div className="site-container py-8 md:py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center">
              <Newspaper className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">پالیز نیوز</p>
              <p className="text-[10px] text-neutral-500 tracking-widest uppercase">
                Paliz News
              </p>
            </div>
          </div>

          <p className="text-xs text-neutral-500 text-center max-w-md leading-relaxed">
            آخرین اخبار ایران و جهان از معتبرترین منابع خبری
          </p>

          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} پالیز نیوز
          </p>
        </div>
      </div>
    </footer>
  );
}