import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemHeader,
  ItemFooter,
  Button,
  IconTile,
  Phone,
  Mail,
  Truck,
  ShieldCheck,
  Package,
  ChevronRight,
} from "agl-pallet";

export const OutlineWithAction = () => (
  <div className="bg-moss p-8 text-bone">
    <Item variant="outline" className="max-w-xl">
      <ItemMedia>
        <IconTile icon={Phone} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Call sales</ItemTitle>
        <ItemDescription>234-286-0402 — a person picks up, weekdays 7am to 5pm Eastern.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button href="tel:+12342860402" label="Call" variant="secondary" arrow={false} />
      </ItemActions>
    </Item>
  </div>
);

export const Variants = () => (
  <div className="flex max-w-xl flex-col gap-4 bg-moss p-8 text-bone">
    <Item>
      <ItemMedia variant="icon">
        <Truck />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Default</ItemTitle>
        <ItemDescription>Freight booked and tracked on every order.</ItemDescription>
      </ItemContent>
    </Item>
    <Item variant="outline">
      <ItemMedia variant="icon">
        <ShieldCheck />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Outline</ItemTitle>
        <ItemDescription>ISPM-15 heat-treated stock for export loads.</ItemDescription>
      </ItemContent>
    </Item>
    <Item variant="muted">
      <ItemMedia variant="icon">
        <Package />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Muted</ItemTitle>
        <ItemDescription>Crates, dunnage, and blocks sourced with the pallets.</ItemDescription>
      </ItemContent>
    </Item>
  </div>
);

export const GroupedList = () => (
  <div className="surface-light bg-bone p-8 text-moss">
    <ItemGroup className="max-w-xl">
      {[
        { title: "Stock pallets", body: "48×40 GMA and other standard footprints for recurring volume." },
        { title: "Custom & engineered", body: "Spec'd to your load, then sourced from a shop set up to build it." },
        { title: "Shipping blocks", body: "Raise, space, and stabilize palletized and irregular loads." },
      ].map((line, i) => (
        <div key={line.title}>
          {i > 0 ? <ItemSeparator /> : null}
          <Item size="sm" asChild>
            <a href="/products/">
              <ItemContent>
                <ItemTitle>{line.title}</ItemTitle>
                <ItemDescription className="text-current/70">{line.body}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <ChevronRight className="size-4" />
              </ItemActions>
            </a>
          </Item>
        </div>
      ))}
    </ItemGroup>
  </div>
);

export const HeaderAndFooter = () => (
  <div className="bg-moss p-8 text-bone">
    <Item variant="outline" className="max-w-md">
      <ItemHeader>
        <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-gray">Supplier inquiry</span>
        <Mail className="size-4 text-ice" />
      </ItemHeader>
      <ItemContent>
        <ItemTitle>I build pallets</ItemTitle>
        <ItemDescription>Tell us what your shop runs — species, footprints, and weekly capacity.</ItemDescription>
      </ItemContent>
      <ItemFooter>
        <span className="text-sm text-current/75">Steady recurring volume, paid on time.</span>
        <Button href="/partners/suppliers/" label="Supply pallets" variant="ghost" />
      </ItemFooter>
    </Item>
  </div>
);
