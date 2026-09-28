export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "agl-theme";

export function isTheme(value: string | null | undefined): value is Theme {
  return value === "dark" || value === "light";
}

/** Blocking head script. Default dark so first paint matches home. */
export const THEME_BOOT_SCRIPT = `(function(){var k="${THEME_STORAGE_KEY}";function apply(t){var h=document.documentElement;var l=t==="light";h.dataset.field=t;h.classList.toggle("dark",!l);h.classList.toggle("light",l);h.classList.toggle("surface-light",l);var b=document.body;if(!b)return;b.classList.toggle("surface-light",l);b.classList.toggle("bg-bone",l);b.classList.toggle("text-moss",l);b.classList.toggle("bg-moss",!l);b.classList.toggle("text-bone",!l)}var t="dark";try{var s=localStorage.getItem(k);if(s==="light"||s==="dark")t=s}catch(e){}apply(t);document.addEventListener("click",function(e){var n=e.target&&e.target.closest&&e.target.closest("[data-theme-toggle]");if(!n)return;apply(document.documentElement.dataset.field==="light"?"dark":"light");try{localStorage.setItem(k,document.documentElement.dataset.field)}catch(err){}})})();`;
