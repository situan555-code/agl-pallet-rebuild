import { createCn } from "cn/config";

// AGL font-size tokens (tailwind.config.ts theme.extend.fontSize). Without
// this, cn treats e.g. `text-link` as a color and drops it when merged with
// `text-white`. Keep in sync with tailwind.config.ts.
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
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
          ],
        },
      ],
    },
  },
});
