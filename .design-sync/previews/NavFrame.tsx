import { NavFrame, Button } from "agl-pallet";

const LOGO = "https://nx7k-lab-m4.vercel.app/assets/agl_pallet_logo-light.svg";
const link = "inline-flex h-8 items-center whitespace-nowrap rounded-full px-2 text-[13px] font-semibold text-current hover:bg-current/8";

// NavFrame is `position: fixed`; transform-gpu scopes it to the story wrapper.
export const PillNav = () => (
  <div className="relative min-h-32 transform-gpu bg-moss text-bone">
    <NavFrame className="text-current">
      <a href="/" className="shrink-0">
        <img src={LOGO} width={65} height={29} alt="AGL Pallet" className="h-[29px] w-auto" />
      </a>
      <nav aria-label="Main">
        <ul className="flex items-center gap-0.5">
          {[
            ["Products", "/products/"],
            ["Industries", "/industries/"],
            ["How We Work", "/how-we-work/"],
            ["Who We Are", "/who-we-are/"],
            ["Partners", "/partners/"],
            ["FAQ", "/faq/"],
            ["Contact", "/contact/"],
          ].map(([label, href]) => (
            <li key={href}>
              <a href={href} className={link}>{label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <Button href="/request-a-quote/" label="Request a Quote" />
    </NavFrame>
  </div>
);

export const Minimal = () => (
  <div className="relative min-h-32 transform-gpu bg-moss text-bone">
    <NavFrame className="text-current">
      <a href="/" className="shrink-0">
        <img src={LOGO} width={65} height={29} alt="AGL Pallet" className="h-[29px] w-auto" />
      </a>
      <Button href="/" label="Back to Home" variant="secondary" />
    </NavFrame>
  </div>
);
