export type CTA = { label: string; href: string };

export type TextWithImageSection = {
  type: "textWithImage";
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  image: string;
  alt: string;
  imageSide: "left" | "right";
  edgeShape?: "left" | "right";
  cta?: CTA;
};

export type VideoSection = {
  type: "video";
  src: string;
  poster?: string;
  controls: boolean;
  autoPlay: boolean;
  muted: boolean;
  loop: boolean;
};

export type StatBandSection = {
  type: "statBand";
  stats: { value: string; label: string }[];
};

export type ProcessStepsSection = {
  type: "processSteps";
  eyebrow: string;
  heading: string;
  steps: { icon: string; heading: string; body: string }[];
};

export type CTABandSection = {
  type: "ctaBand";
  eyebrow: string;
  heading: string;
  body: string;
  backgroundImage: string;
  cta: CTA;
};

export type HomeSection =
  | TextWithImageSection
  | StatBandSection
  | VideoSection
  | ProcessStepsSection
  | CTABandSection;
