import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-neutral-800/50 bg-black/50">
      <div className="site-container py-10 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 md:w-16 md:h-16">
              <Image
                src="/logo.png"
                alt="پالیز نیوز"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-base md:text-lg font-black text-white">پالیز نیوز</p>
              <p className="text-[10px] text-neutral-500 tracking-[0.2em] uppercase font-semibold">
                PALIZ NEWZ
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs md:text-sm text-neutral-500 text-center max-w-md leading-relaxed">
            آخرین اخبار ایران و جهان از معتبرترین منابع خبری
          </p>

          {/* Copyright */}
          <p className="text-xs text-neutral-600 font-medium">
            © {new Date().getFullYear()} پالیز نیوز
          </p>
        </div>
      </div>
    </footer>
  );
}