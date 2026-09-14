import Link from "next/link";
import Image from "next/image";

type ButtonVariant = "pill-light" | "pill-dark";

const variantClasses: Record<ButtonVariant, string> = {
  "pill-light":
    "bg-white text-brand-green hover:bg-surface active:bg-surface-alt",
  "pill-dark":
    "bg-brand-green text-white hover:bg-ink active:brightness-90",
};

const arrowIcon: Record<ButtonVariant, string> = {
  "pill-light": "/assets/circle_arrow_dark.svg",
  "pill-dark": "/assets/circle_arrow.svg",
};

export function Button({
  href,
  label,
  variant = "pill-dark",
}: {
  href: string;
  label: string;
  variant?: ButtonVariant;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={`relative inline-block rounded-full py-[15px] pl-[18px] pr-[50px] text-button font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
        variant === "pill-light"
          ? "focus-visible:outline-white"
          : "focus-visible:outline-brand-green"
      } ${variantClasses[variant]}`}
    >
      {label}
      <Image
        src={arrowIcon[variant]}
        alt=""
        width={30}
        height={30}
        className="absolute right-[10px] top-1/2 -translate-y-1/2"
      />
    </Link>
  );
}
