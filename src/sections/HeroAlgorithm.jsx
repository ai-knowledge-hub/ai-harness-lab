export function HeroAlgorithm() {
  return (
    <div className="hero-algorithm" aria-label="Animated algorithm system overview">
      <svg viewBox="0 0 900 280" role="img" aria-labelledby="hero-algorithm-title">
        <title id="hero-algorithm-title">Animated deterministic algorithm pipeline</title>
        <g className="hero-bars" aria-label="Binary search threshold bars">
          <line x1="70" y1="136" x2="286" y2="136" className="hero-threshold"></line>
          <rect x="76" y="158" width="24" height="42" rx="5"></rect>
          <rect x="108" y="144" width="24" height="56" rx="5"></rect>
          <rect x="140" y="118" width="24" height="82" rx="5"></rect>
          <rect x="172" y="102" width="24" height="98" rx="5"></rect>
          <rect x="204" y="74" width="24" height="126" rx="5" className="active"></rect>
          <rect x="236" y="58" width="24" height="142" rx="5"></rect>
          <rect x="268" y="66" width="24" height="134" rx="5"></rect>
          <g className="hero-cursor">
            <path d="M216 50v20M204 70h24"></path>
            <text x="216" y="38">
              threshold found
            </text>
          </g>
        </g>

        <g className="hero-nodes" aria-label="Breadth-first crawl nodes">
          <line x1="450" y1="60" x2="396" y2="128"></line>
          <line x1="450" y1="60" x2="450" y2="128"></line>
          <line x1="450" y1="60" x2="504" y2="128"></line>
          <line x1="396" y1="128" x2="366" y2="202"></line>
          <line x1="396" y1="128" x2="426" y2="202"></line>
          <line x1="504" y1="128" x2="474" y2="202"></line>
          <line x1="504" y1="128" x2="534" y2="202"></line>
          <circle cx="450" cy="60" r="18"></circle>
          <circle cx="396" cy="128" r="18"></circle>
          <circle cx="450" cy="128" r="18"></circle>
          <circle cx="504" cy="128" r="18"></circle>
          <circle cx="366" cy="202" r="18"></circle>
          <circle cx="426" cy="202" r="18"></circle>
          <circle cx="474" cy="202" r="18"></circle>
          <circle cx="534" cy="202" r="18"></circle>
        </g>

        <g className="hero-route" aria-label="Cheapest tool path">
          <line x1="632" y1="92" x2="714" y2="54"></line>
          <line x1="632" y1="92" x2="714" y2="132"></line>
          <line x1="714" y1="54" x2="792" y2="92" className="best"></line>
          <line x1="714" y1="132" x2="792" y2="92"></line>
          <line x1="792" y1="92" x2="830" y2="184" className="best"></line>
          <circle cx="632" cy="92" r="20"></circle>
          <circle cx="714" cy="54" r="20" className="best-node"></circle>
          <circle cx="714" cy="132" r="20"></circle>
          <circle cx="792" cy="92" r="20" className="best-node"></circle>
          <circle cx="830" cy="184" r="20" className="best-node"></circle>
        </g>
      </svg>
    </div>
  );
}
