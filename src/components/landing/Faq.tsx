import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How do I know which extinguisher size I need?",
    a: "Use the Fire Risk Wizard above — it factors in room size and the main hazard to recommend a size and type. For multi-room sites, we recommend a free site survey.",
  },
  {
    q: "What's the difference between ABC and CO2 extinguishers?",
    a: "ABC dry powder handles solid, liquid, and electrical fires (Class A/B/C) and leaves residue. CO2 is residue-free and ideal for electronics and server rooms, but is only rated for B/C fires.",
  },
  {
    q: "Do you provide installation?",
    a: "Yes — every order includes wall-mount installation and signage placement guidance at no extra cost within serviceable cities.",
  },
  {
    q: "How does the AMC (Annual Maintenance Contract) work?",
    a: "We inspect pressure, seals, and expiry dates on a schedule matched to your plan, and issue compliance certificates after each visit.",
  },
  {
    q: "Can I generate and pay a bill online?",
    a: "Yes — head to the Bill page to generate an invoice or check the status of an existing one, with UPI payment support.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="bg-neutral-50 py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-neutral-900 sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
