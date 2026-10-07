import { Footer2 } from "agl-pallet";

const logo = {
  src: "/assets/agl_pallet_logo-light.svg",
  width: 112,
  height: 50,
  alt: "AGL Pallet",
};

export const ThreeColumns = () => (
  <div className="bg-moss pt-px text-bone">
    <Footer2
      logo={logo}
      description="AGL Pallet sources new, custom, and engineered pallets from family-run mills across the Midwest and Mid-Atlantic, and manages the freight on every order."
      contact={{ phone: "234-286-0402", email: "sales@aglpallet.com" }}
      cta={{ label: "Request a Quote", href: "/request-a-quote/" }}
      sections={[
        {
          title: "Products",
          links: [
            { label: "Stock Pallets", href: "/products/#stock-pallets" },
            { label: "Custom & Engineered", href: "/custom-engineered/" },
            { label: "Crates", href: "/products/#crates" },
            { label: "Dunnage", href: "/products/#dunnage" },
            { label: "Shipping Blocks", href: "/products/#shipping-blocks" },
            { label: "Stakes", href: "/products/#stakes" },
          ],
        },
        {
          title: "Company",
          links: [
            { label: "Who We Are", href: "/who-we-are/" },
            { label: "How We Work", href: "/how-we-work/" },
            { label: "The Pledge", href: "/the-pledge/" },
            { label: "Industries", href: "/industries/" },
            { label: "FAQ", href: "/faq/" },
            { label: "Resources", href: "/resources/" },
          ],
        },
        {
          title: "Partners",
          links: [
            { label: "For Mills & Shops", href: "/partners/suppliers/" },
            { label: "For Carriers", href: "/partners/carriers/" },
            { label: "Contact", href: "/contact/" },
          ],
        },
      ]}
      copyright="© 2026 AGL Pallet LLC. All rights reserved."
    />
  </div>
);

export const PartnerFooterOnLight = () => (
  <div className="surface-light bg-bone pt-px text-moss">
    <Footer2
      logo={{ ...logo, src: "/assets/agl_pallet_logo-dark.svg" }}
      description="Mills, shops, and carriers: AGL buys pallets and books freight. We never build them, so we never compete with you for the order."
      contact={{ phone: "234-286-0402", email: "sales@aglpallet.com" }}
      cta={{ label: "Supply pallets to AGL", href: "/partners/suppliers/" }}
      sections={[
        {
          title: "Partners",
          links: [
            { label: "For Mills & Shops", href: "/partners/suppliers/" },
            { label: "For Carriers", href: "/partners/carriers/" },
          ],
        },
        {
          title: "Company",
          links: [
            { label: "Who We Are", href: "/who-we-are/" },
            { label: "How We Work", href: "/how-we-work/" },
            { label: "Contact", href: "/contact/" },
          ],
        },
      ]}
      copyright="© 2026 AGL Pallet LLC. All rights reserved."
    />
  </div>
);
