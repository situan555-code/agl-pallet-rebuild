import { Faq3 } from "agl-pallet";

const items = [
  {
    id: "faq-1",
    question: "Do I need a two-way or four-way pallet?",
    answer: "A two-way pallet takes a forklift or pallet jack from two opposite sides. A four-way takes entry from all four. Which one you need depends on how your dock, racking, and material-handling equipment move the load — not on which one is \"better\" in the abstract.",
  },
  {
    id: "faq-2",
    question: "Lead times",
    answer: "Lead time is driven by the mills behind the spec and the freight lane, not by a single plant schedule we own. When you send a spec and a quantity, we come back the same day with availability and a realistic ship window.",
  },
  {
    id: "faq-3",
    question: "Minimums",
    answer: "No minimums. One truckload or forty. Order size does not decide whether we pick up the phone.",
  },
];

export const BuyerQuestions = () => (
  <div className="bg-moss pb-12 text-bone">
    <Faq3 id="questions" heading="Buyer questions" items={items} />
  </div>
);

export const WithIntro = () => (
  <div className="surface-light bg-bone pb-12 text-moss">
    <Faq3
      eyebrow="FAQ"
      heading="Before you call"
      description="Straight answers to the questions buyers ask on the first call."
      items={items.slice(0, 2)}
    />
  </div>
);
