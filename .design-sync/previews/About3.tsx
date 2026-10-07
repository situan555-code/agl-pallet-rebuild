import { About3 } from "agl-pallet";

export const TwoSections = () => (
  <div className="bg-moss pb-12 text-bone">
    <About3
      sections={[
        {
          label: "What we stand on",
          title: "AGL is a Christ-centered company.",
          paragraphs: [
            "It shapes how we deal with people more than what we sell. Mills get paid when we said we'd pay them. Customers get told what we can and can't do, including when the honest answer costs us the order.",
            "We don't think that makes us a better vendor than anyone else, and we won't ask you to care about it. It's just who we are, and it's why the company runs the way it does.",
          ],
        },
        {
          label: "North Canton, Ohio",
          paragraphs: [
            "Our supplier network is centered in Eastern Ohio and Western Pennsylvania and it's growing. We serve manufacturers across Michigan, Illinois, Indiana, Pennsylvania, Ohio, and West Virginia — the Midwest and Mid-Atlantic, and expanding as new mills come on.",
          ],
        },
      ]}
    />
  </div>
);

export const SingleSectionOnLight = () => (
  <div className="surface-light bg-bone pb-12 text-moss">
    <About3
      sections={[
        {
          label: "From the owner",
          title: "Why I built it this way",
          paragraphs: [
            "I spent years on the buying side, and the pattern never changed: the pallet was the cheapest thing on the line and the fastest way to stop it.",
            "We don't own a mill and we never will. I've watched what happens to the family shops when a broker buys a plant, and I'd rather have their capacity and their trust.",
          ],
        },
      ]}
    />
  </div>
);
