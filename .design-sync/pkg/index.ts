// design-sync entry: the AGL Pallet site's real components, re-exported for
// claude.ai/design. Nothing here is reimplemented - every export is the
// component the site ships. Next.js-only imports (next/link, next/image,
// next/navigation, next/dynamic) resolve to ./shims via ./tsconfig.json.

// Layout + surfaces
export { Container } from "../../components/Container";
export { Section } from "../../components/Section";
export { SectionHeading } from "../../components/SectionHeading";
export { NavFrame } from "../../components/NavFrame";
export { Reveal } from "../../components/Reveal";

// Actions
export { Button } from "../../components/Button";
export { CopyValue } from "../../components/CopyValue";
export { QuoteCopyButton } from "../../components/QuoteCopyButton";
export { ThemeToggle } from "../../components/theme-toggle";

// Cards + media
export { InteractiveCard } from "../../components/InteractiveCard";
export { CardMedia } from "../../components/CardMedia";
export { IconTile } from "../../components/IconTile";
export { PhotoPlaceholder } from "../../components/PhotoPlaceholder";
export { RuleList } from "../../components/RuleList";
export { QuoteContacts } from "../../components/QuoteContacts";

// Page sections
export { PageOpener } from "../../components/PageOpener";
export { HeroExpand } from "../../components/HeroExpand";
export { ImageBand } from "../../components/ImageBand";
export { NetworkBeam } from "../../components/NetworkBeam";
export { OhioPlantMap } from "../../components/OhioPlantMap";
export { Hero1 } from "../../components/hero1";
export { Hero3 } from "../../components/hero3";
export { About3 } from "../../components/about3";
export { Feature1 } from "../../components/feature1";
export { Feature2 } from "../../components/feature2";
export { Feature3 } from "../../components/feature3";
export { Process1 } from "../../components/process1";
export { Faq3 } from "../../components/faq3";
export { Cta4 } from "../../components/cta4";
export { Contact2 } from "../../components/contact2";
export { Gallery4 } from "../../components/gallery4";
export { Form } from "../../components/Form";

// Site chrome
export { Header } from "../../components/Header";
export { Footer } from "../../components/Footer";
export { Footer2 } from "../../components/footer2";

// shadcn/ui primitives (radix-nova style)
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../components/ui/accordion";
export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "../../components/ui/carousel";
export * from "../../components/ui/dropdown-menu";
export * from "../../components/ui/item";
export * from "../../components/ui/navigation-menu";
export * from "../../components/ui/select";
export { Separator } from "../../components/ui/separator";
export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from "../../components/ui/sheet";
export { Toggle } from "../../components/ui/toggle";
export { AnimatedBeam } from "../../components/ui/animated-beam";
export { BlurFade } from "../../components/ui/blur-fade";
export { DotPattern } from "../../components/ui/dot-pattern";

// Icons (inline-icons.tsx wins the PhoneIcon name clash with icons.tsx)
export * from "../../components/inline-icons";
export { FacebookIcon, LinkedInIcon, EnvelopeIcon, HamburgerIcon, CloseIcon, ArrowIcon } from "../../components/icons";

// Lucide icons the site itself imports (app/, components/, lib/) - the set
// IconTile / Feature3 / Process1 take as `icon`. Not the whole library.
export { AlertCircle, ArrowLeft, ArrowRight, BadgeCheck, Boxes, Building2, Check, ChevronDown, ChevronLeft, ChevronRight, Clock, Copy, Factory, Handshake, Layers, Mail, MapPin, MessageSquare, Moon, Network, Package, Phone, Plus, Repeat, Settings2, ShieldCheck, Sun, Truck, UserRound } from "lucide-react";
