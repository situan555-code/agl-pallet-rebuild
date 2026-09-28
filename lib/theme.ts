export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "agl-theme";

export function isTheme(value: string | null | undefined): value is Theme {
  return value === "dark" || value === "light";
}

export function applyTheme(theme: Theme) {
  const html = document.documentElement;
  const body = document.body;
  const light = theme === "light";
  html.dataset.field = theme;
  html.classList.toggle("dark", !light);
  html.classList.toggle("light", light);
  if (!body) return;
  body.classList.toggle("surface-light", light);
  body.classList.toggle("bg-bone", light);
  body.classList.toggle("text-moss", light);
  body.classList.toggle("bg-moss", !light);
  body.classList.toggle("text-bone", !light);
}

/** Blocking body script. Default dark so first paint matches home. */
export const THEME_BOOT_SCRIPT = `(function(){var t="dark";try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");if(s==="light"||s==="dark")t=s}catch(e){}var h=document.documentElement;h.dataset.field=t;h.classList.toggle("dark",t!=="light");h.classList.toggle("light",t==="light");var b=document.body;if(!b)return;var l=t==="light";b.classList.toggle("surface-light",l);b.classList.toggle("bg-bone",l);b.classList.toggle("text-moss",l);b.classList.toggle("bg-moss",!l);b.classList.toggle("text-bone",!l)})();`;
