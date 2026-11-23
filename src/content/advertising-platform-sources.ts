// Source register checked against primary publications on 23 November 2026.
// S2 corrects the supplied DOI; S7 and S11 replace broad/unavailable URLs.
export const platformSources = {
  S1: { label: "Edelman, Ostrovsky and Schwarz (2007)", title: "Internet Advertising and the Generalized Second-Price Auction", url: "https://doi.org/10.1257/aer.97.1.242" },
  S2: { label: "Balseiro and Gur (2019)", title: "Learning in Repeated Auctions with Budgets: Regret Minimization and Equilibrium", url: "https://doi.org/10.1287/mnsc.2018.3174" },
  S3: { label: "Google: Ad Rank", title: "Google Ads: About Ad Rank", url: "https://support.google.com/google-ads/answer/1722122" },
  S4: { label: "IAB Tech Lab: OpenRTB 2.6", title: "OpenRTB 2.6, Object: Bid; revision 21109db", url: "https://github.com/InteractiveAdvertisingBureau/openrtb2.x/blob/21109db5519c20422d413f3a45732fe9916a93e4/2.6.md#423---object-bid" },
  S5: { label: "Google: Programmatic Guaranteed", title: "Google Authorized Buyers: Programmatic Guaranteed Deals", url: "https://developers.google.com/authorized-buyers/apis/guides/marketplace/programmatic-guaranteed-deals" },
  S6: { label: "IAB/MRC: viewability", title: "IAB/MRC Retail Media Measurement Guidelines, January 2024, section 3.2, page 21", url: "https://mediaratingcouncil.org/sites/default/files/Standards/IAB_Retail_Media_Measurement_Guidelines_January2024.pdf#page=21" },
  S7: { label: "Google Ads: conversion-date metrics", title: "Google Ads API v26: metrics.conversions_by_conversion_date", url: "https://developers.google.com/google-ads/api/fields/v26/metrics#metrics.conversions_by_conversion_date" },
  S8: { label: "Akidau et al. (2015)", title: "The Dataflow Model: A Practical Approach to Balancing Correctness, Latency, and Cost in Massive-Scale, Unbounded, Out-of-Order Data Processing", url: "https://research.google/pubs/the-dataflow-model-a-practical-approach-to-balancing-correctness-latency-and-cost-in-massive-scale-unbounded-out-of-order-data-processing/" },
  S9: { label: "Amazon Marketing Cloud", title: "Amazon Marketing Cloud: privacy controls and aggregated outputs", url: "https://advertising.amazon.com/en-gb/solutions/products/amazon-marketing-cloud" },
  S10: { label: "Lewis and Rao (2015)", title: "The Unfavorable Economics of Measuring the Returns to Advertising", url: "https://doi.org/10.1093/qje/qjv023" },
  S11: { label: "Google: reporting and configuration APIs", title: "Google Bid Manager API FAQ: reporting versus resource configuration", url: "https://developers.google.com/bid-manager/guides/faq" },
} as const;
export type PlatformSourceId = keyof typeof platformSources;
