import { Link } from "react-router-dom";

const views = [
  {
    title: "Work out what someone is looking for", input: "Details from the conversation", output: "Searches for products or services",
    documented: "The orchestrator turns relevant details from the chat into searches for ads. It can revise those searches as the person’s goal becomes clearer.",
    example: 'If someone asks for lightweight shoes for a rainy city break, the system might look for “water-resistant walking shoes” or “packable travel footwear”.',
    implication: "Describe what your product actually helps people do. Test whether that message performs well. The system can look for related meanings as well as matching words.",
  },
  {
    title: "Find ads with a similar meaning", input: "Searches based on the chat", output: "Possible ads",
    documented: "The system turns the meaning of each search into a list of numbers called an embedding. It compares these numbers with those for ads in several searchable collections to find close matches quickly.",
    example: "In our example, one tool creates the numbers and another looks for matches. The numbers and search settings in the download are made up.",
    implication: "Keep product details accurate and make sure the landing page matches the ad. The search that led to an individual ad stays inside the platform.",
  },
  {
    title: "Check which ads qualify", input: "Possible ads", output: "Ads that pass the checks",
    documented: "The system can check whether the ad is active, fits the audience and placement, follows policy and has budget left. It can also spread spending over time (pacing) and remove repeated candidates.",
    example: "A walking shoe ad might fit a conversation about a trip, but the campaign might only run in France while the person is in Canada.",
    implication: "If an ad rarely shows, check where it can run and whether the campaign has budget before rewriting the copy.",
  },
  {
    title: "Score relevance and quality", input: "Ads that qualify", output: "Ads with scores",
    documented: "The system can score how well an ad fits the person’s goal, how likely people are to interact with it and how it performed before.",
    example: "Our example uses made-up scores between 0 and 1 so you can see what a scoring result might look like. OpenAI keeps its scoring rules and scores private.",
    implication: "Compare versions of an ad with a test that you can explain. Click-through rate divides clicks by impressions and shows the result as a percentage. The platform’s own scores stay private.",
  },
  {
    title: "Shortlist ads and run the auction", input: "Ads that fit the chat", output: "Ad choice and price",
    documented: "The orchestrator shortlists ads. The auction decides which can compete, uses quality as part of the ranking, then picks the ad and sets the price.",
    example: "The download includes a made-up bid and price to show what an auction record could contain. Use OpenAI’s documentation for billing rules.",
    implication: "Track what you bid and what you were charged separately. Use campaign results to assess performance. The reasons for an individual auction result stay private.",
  },
  {
    title: "Check the fit and show the ad on time", input: "Selected ad and current conversation", output: "Ad blocked, sent or shown",
    documented: "The final check can stop an ad that feels out of place in the conversation. An ad can also pass the check and be sent, yet arrive too late to show.",
    example: "In our example, one record says whether the ad passed the final check. Another says whether it arrived late or was shown.",
    implication: "Use impressions to count ads that were shown. Keep a timing problem separate from a decision to block an ad.",
  },
];

export function AdsOrchestrator() {
  return <div className="orchestrator-detail">
    <p>The orchestrator is the AI model that decides which ad selection tools to use. Open each step to see what it starts with and what it produces. The model can go back to a tool when it needs to.</p>
    <p><a className="source-citation" href="https://openai.com/index/building-chatgpt-ad-stack/">Source: OpenAI’s engineering account</a></p>
    <p className="reference-small">The steps below describe work that happens inside OpenAI. Advertiser reports give you campaign results. <Link className="text-link" to="/learn/system-design/chatgpt-ads-apis">See what advertisers can do with the APIs.</Link></p>
    <ol className="orchestrator-views">{views.map((view, index) => <li key={view.title}>
      <details>
        <summary><span aria-hidden="true">0{index + 1}</span>{view.title}</summary>
        <div className="orchestrator-body">
          <p className="reference-provenance">Based on OpenAI’s description</p>
          <div className="orchestrator-flow" aria-label={`${view.input} to ${view.output}`}>
            <span>{view.input}</span>
            <svg viewBox="0 0 80 20" aria-hidden="true"><path d="M0 10H76M68 3l8 7-8 7" fill="none" stroke="currentColor" /></svg>
            <span>{view.output}</span>
          </div>
          <p>{view.documented}</p>
          <dl className="reference-definitions">
            <dt>Harness example</dt><dd>{view.example}</dd>
            <dt>What this means for advertisers</dt><dd>{view.implication}</dd>
          </dl>
        </div>
      </details>
    </li>)}</ol>
    <p className="reference-small">The conversation and the details of how individual ads were chosen stay inside the platform.</p>
  </div>;
}
