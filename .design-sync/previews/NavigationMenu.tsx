import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "agl-pallet";

const products = [
  { label: "Stock Pallets", href: "/products/#stock-pallets", note: "48×40 GMA and recurring-volume specs." },
  { label: "Custom & Engineered", href: "/custom-engineered/", note: "Built to your load, racking, and dock." },
  { label: "Crates", href: "/products/#crates", note: "Export and heavy-equipment crating." },
  { label: "Dunnage", href: "/products/#dunnage", note: "Blocking and bracing for the load." },
];

const partners = [
  { label: "For Mills & Shops", href: "/partners/suppliers/", note: "Steady recurring volume, paid on time." },
  { label: "For Carriers", href: "/partners/carriers/", note: "Regional lanes, mill to plant." },
];

function Panel({ items }: { items: { label: string; href: string; note: string }[] }) {
  return (
    <ul className="grid w-[min(40rem,calc(100vw-2rem))] grid-cols-2 gap-1 p-2">
      {items.map((item) => (
        <li key={item.href}>
          <NavigationMenuLink href={item.href} className="flex-col items-start gap-1 p-3">
            <span className="text-sm font-semibold">{item.label}</span>
            <span className="text-xs text-muted-foreground">{item.note}</span>
          </NavigationMenuLink>
        </li>
      ))}
    </ul>
  );
}

export const ProductsOpen = () => (
  <div className="min-h-[600px] bg-moss p-8 text-bone">
    <NavigationMenu defaultValue="products">
      <NavigationMenuList>
        <NavigationMenuItem value="products">
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <Panel items={products} />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="partners">
          <NavigationMenuTrigger>Partners</NavigationMenuTrigger>
          <NavigationMenuContent>
            <Panel items={partners} />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/how-we-work/" className="px-2.5 font-medium">How We Work</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/faq/" className="px-2.5 font-medium">FAQ</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </div>
);

export const Collapsed = () => (
  <div className="bg-moss p-8 text-bone">
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem value="products">
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <Panel items={products} />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="partners">
          <NavigationMenuTrigger>Partners</NavigationMenuTrigger>
          <NavigationMenuContent>
            <Panel items={partners} />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/contact/" className="px-2.5 font-medium">Contact</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </div>
);
