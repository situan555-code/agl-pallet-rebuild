import { SectionHeading } from "@/components/SectionHeading";

export function ListBlock({
  eyebrow,
  heading,
  body,
  items,
}: {
  eyebrow?: string;
  heading: string;
  body?: string;
  items: { lead: string; body: string }[];
}) {
  return (
    <div>
      <SectionHeading eyebrow={eyebrow} heading={heading} />
      {body && <p className="prose-measure mt-6 text-body">{body}</p>}
      <ul className={`prose-measure space-y-4 ${body ? "mt-4" : "mt-6"}`}>
        {items.map((item) => (
          <li key={item.lead} className="text-body">
            <strong className="text-brand-green">{item.lead}</strong> — {item.body}
          </li>
        ))}
      </ul>
    </div>
  );
}
