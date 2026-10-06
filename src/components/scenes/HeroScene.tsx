export function HeroScene() {
  return (
    <section className="panel panel--hero" aria-label="Introduction">
      {/* Centred like every other scene, then hung from the viewport's
          middle so the name opens at eye level rather than at the top. */}
      <div className="panel-center">
        <h1 className="hero-name">
          <span className="hero-line">MUHAMMAD</span>
          <span className="hero-line">FIKRI</span>
        </h1>
        <p className="hero-role">MACHINE LEARNING ENGINEER • AI RESEARCHER • SOFTWARE ENGINEERING</p>
        <p className="hero-cue" aria-hidden="true">
          SCROLL TO ENTER
        </p>
      </div>
    </section>
  )
}