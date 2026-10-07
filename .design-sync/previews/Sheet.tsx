import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
  Button,
  Phone,
  Mail,
} from "agl-pallet";

const nav = [
  ["Products", "/products/"],
  ["Industries", "/industries/"],
  ["How We Work", "/how-we-work/"],
  ["Who We Are", "/who-we-are/"],
  ["Partners", "/partners/"],
  ["FAQ", "/faq/"],
  ["Contact", "/contact/"],
];

export const MenuSheetOpen = () => (
  <div className="min-h-[600px] bg-moss p-8 text-bone">
    <Sheet defaultOpen>
      <SheetTrigger className="inline-flex h-9 items-center rounded-full border border-current/25 px-3 text-[13px] font-semibold">
        Menu
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Pallets sourced from family-run mills, freight managed on every order.</SheetDescription>
        </SheetHeader>
        <nav className="px-4">
          <ul className="grid">
            {nav.map(([label, href]) => (
              <li key={href}>
                <a href={href} className="block border-b border-current/15 py-3 text-[15px] font-semibold text-current">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <SheetFooter>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Phone className="size-4" /> 234-286-0402</li>
            <li className="flex items-center gap-2"><Mail className="size-4" /> sales@aglpallet.com</li>
          </ul>
          <SheetClose asChild>
            <Button href="/request-a-quote/" label="Request a Quote" />
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </div>
);

export const QuoteSheetBottom = () => (
  <div className="min-h-[600px] bg-moss p-8 text-bone">
    <Sheet defaultOpen>
      <SheetTrigger className="inline-flex h-9 items-center rounded-full border border-current/25 px-3 text-[13px] font-semibold">
        Get a quote
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Send us a spec and a quantity.</SheetTitle>
          <SheetDescription>
            We'll come back the same day. No minimums, and more than one qualified source behind whatever you're buying.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter className="flex-row">
          <Button href="/request-a-quote/" label="Request a Quote" />
          <Button href="tel:2342860402" label="Call 234-286-0402" variant="secondary" arrow={false} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </div>
);
