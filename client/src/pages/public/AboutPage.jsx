export default function AboutPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="page-container max-w-3xl mx-auto text-center">
        <p className="section-label mb-6">— Our Story</p>
        <h1 className="section-title mb-6">Crafted With <em className="italic text-gold">Purpose</em></h1>
        <div className="gold-divider" />
        <p className="font-sans text-sm leading-loose text-cream-faint mt-8 mb-6">
          Maison Luxe was founded on a singular belief: that true luxury is not about excess, but about intention. Every piece in our collection is chosen for its exceptional craftsmanship, timeless design, and the story it carries.
        </p>
        <p className="font-sans text-sm leading-loose text-cream-faint mb-16">
          We work directly with artisans and heritage brands across Europe, Asia, and the Americas — ensuring every product meets our uncompromising standards of quality and authenticity.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {[["Authenticity","Every product verified and sourced directly from makers."],["Craftsmanship","We celebrate artisans who dedicate their lives to their craft."],["Timelessness","Pieces built to outlast trends and pass between generations."]].map(([t,d]) => (
            <div key={t} className="border border-gold/15 p-8 text-left">
              <div className="w-8 h-px bg-gold mb-6" />
              <h3 className="font-serif text-xl text-cream mb-3">{t}</h3>
              <p className="font-sans text-xs leading-loose text-cream-faint">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
