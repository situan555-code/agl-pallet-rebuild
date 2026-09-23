import { cn } from "cn";
"use client";

interface Service2Props {
  className?: string;
}

const Service2 = ({ className }: Service2Props) => {
  return (
    <section className={cn("pb-32", className)}>
      {/* Full Width Hero with Background Image */}
      <div
        className="relative flex min-h-[500px] items-center justify-center bg-cover bg-center bg-no-repeat py-32"
        style={{
          backgroundImage:
            "url('https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/christopher-gower-vjMgqUkS8q8-unsplash.jpg')",
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 container text-center">
          <h1 className="text-4xl font-medium tracking-tight text-white md:text-5xl lg:text-6xl">
            UX/UI Design
          </h1>
        </div>
      </div>

      {/* Intro Section */}
      <div className="py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-8 text-left">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              User-Centered Design That Converts
            </h2>
            <p className="text-xl leading-relaxed text-muted-foreground">
              We believe that great design should be intuitive, accessible, and
              purposeful for every user who interacts with your product. Our
              UX/UI design approach focuses on understanding your users' needs,
              behaviors, and pain points to create interfaces that not only look
              beautiful but function seamlessly.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-16">
        <div className="container">
          <div className="mx-auto prose prose-sm max-w-3xl dark:prose-invert">
            <h2>Creating Meaningful Digital Experiences</h2>
            <p>
              We combine user research, information architecture, and visual
              design to deliver experiences that drive engagement and
              conversions.
            </p>

            <p>
              Through comprehensive user research and testing, we validate
              design decisions with real data. Our iterative design process
              ensures that every element serves a purpose and contributes to
              your business goals while providing an exceptional user
              experience.
            </p>

            <p>
              We specialize in creating design systems that scale with your
              business, ensuring consistency across all touchpoints while
              maintaining flexibility for future growth and evolution.
            </p>

            <p>
              Our collaborative approach involves stakeholders throughout the
              design process, from initial wireframes to final prototypes. This
              ensures alignment between business objectives and user needs,
              resulting in products that succeed in the market.
            </p>

            <p>
              Every design decision is backed by research and testing, creating
              solutions that are not just visually appealing but strategically
              sound and user-validated.
            </p>

            <h2>Our UX/UI Design Services</h2>
            <ul>
              <li>User research and persona development</li>
              <li>Information architecture and user journey mapping</li>
              <li>Wireframing and interactive prototyping</li>
              <li>Visual design and brand integration</li>
              <li>Usability testing and design validation</li>
              <li>Design system creation and documentation</li>
            </ul>

            <h2>Strategic Design for Business Success</h2>
            <p>
              Our design philosophy centers on creating interfaces that bridge
              the gap between user needs and business objectives. We understand
              that great UX/UI design is not just about aesthetics—it's about
              creating meaningful interactions that drive results.
            </p>

            <p>
              From initial concept to final implementation, we ensure that every
              design element contributes to a cohesive user experience that
              reflects your brand values and supports your business goals. Our
              designs are optimized for performance, accessibility, and
              scalability across all devices and platforms.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Service2 };
