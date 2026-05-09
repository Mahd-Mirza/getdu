import Image from "next/image"

type BrandLogoProps = {
  className?: string
  /** Navbar LCP — set true on first paint */
  priority?: boolean
}

/** Site wordmark from `public/logo.png` — keep aspect ratio; height drives layout */
export function BrandLogo({ className = "", priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="GetDu.ae — authorized du partner"
      width={320}
      height={90}
      priority={priority}
      className={`h-10 w-auto max-w-[min(100%,260px)] object-contain object-left sm:h-11 ${className}`}
    />
  )
}
