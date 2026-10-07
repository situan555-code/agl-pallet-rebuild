import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  ChevronDown,
  Package,
  Layers,
  ShieldCheck,
  Boxes,
  Phone,
  Mail,
} from "agl-pallet";

const trigger =
  "inline-flex h-9 items-center gap-1.5 rounded-full border border-current/25 px-3 text-[13px] font-semibold text-current hover:bg-current/8";

export const ProductsMenuOpen = () => (
  <div className="min-h-[600px] bg-moss p-8 text-bone">
    <DropdownMenu defaultOpen modal={false}>
      <DropdownMenuTrigger className={trigger}>
        Products <ChevronDown className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>What AGL sources</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Package /> Stock Pallets
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Layers /> Custom & Engineered
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShieldCheck /> Heat-treated (ISPM-15)
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Boxes /> Crates & Dunnage
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Talk to a broker</DropdownMenuLabel>
        <DropdownMenuItem>
          <Phone /> 234-286-0402
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Mail /> sales@aglpallet.com
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

export const Closed = () => (
  <div className="bg-moss p-8 text-bone">
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className={trigger}>
        Products <ChevronDown className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuItem>Stock Pallets</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);
