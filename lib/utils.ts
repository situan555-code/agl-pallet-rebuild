import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: [
          "display-1",
          "display-2",
          "display-3",
          "display-4",
          "display-kicker",
          "display-row",
          "display-numeral",
          "step-sm",
          "step-lg",
          "body",
          "eyebrow",
          "link",
          "nav-link",
          "button",
        ] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
