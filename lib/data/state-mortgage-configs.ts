import type { Metadata } from 'next'

export type StateConfig = {
  slug: string
  stateName: string
  stateAbbr: string
  avgPropertyTaxRate: number
  avgHomeInsurance: number
  avgHomePrice: number
  majorCities: string[]
  firstTimeBuyerProgram: {
    name: string
    url: string
  }
  contentBlurbs: {
    marketOverview: string
    taxContext: string
  }
  // Override auto-generated metadata
  metaTitle?: string
  metaDescription?: string
  // Highlighted callout rendered before content sections (e.g. tax warning)
  topCallout?: {
    heading: string
    body: string
  }
  // Extra content sections rendered after the first-time buyer section
  extraSections?: Array<{
    heading: string
    paragraphs: string[]
    bullets?: string[]
    link?: { text: string; url: string }
    note?: string
  }>
}

export const ncConfig: StateConfig = {
  slug: 'north-carolina',
  stateName: 'North Carolina',
  stateAbbr: 'NC',
  avgPropertyTaxRate: 0.77,
  avgHomeInsurance: 1400,
  avgHomePrice: 320000,
  majorCities: ['Charlotte', 'Raleigh', 'Durham', 'Asheville'],
  firstTimeBuyerProgram: {
    name: 'NC Home Advantage Mortgage',
    url: 'https://nchfa.com',
  },
  contentBlurbs: {
    marketOverview:
      'North Carolina has seen strong population growth, particularly in the Research Triangle and Charlotte metro areas. Median home prices range from around $280,000 in smaller markets to over $400,000 in Raleigh and Charlotte.',
    taxContext:
      "North Carolina's average effective property tax rate is 0.77%, well below the national average of 1.1%, which helps keep monthly payments lower than many comparable states.",
  },
}

export const scConfig: StateConfig = {
  slug: 'south-carolina',
  stateName: 'South Carolina',
  stateAbbr: 'SC',
  avgPropertyTaxRate: 0.57,
  avgHomeInsurance: 1600,
  avgHomePrice: 290000,
  majorCities: ['Charleston', 'Columbia', 'Greenville', 'Myrtle Beach'],
  firstTimeBuyerProgram: {
    name: 'SC Housing Home Advantage',
    url: 'https://schousing.com',
  },
  contentBlurbs: {
    marketOverview:
      'South Carolina offers some of the most affordable home prices in the Southeast. Charleston and Greenville have seen significant price appreciation, while Columbia and smaller markets remain highly accessible for first-time buyers.',
    taxContext:
      'South Carolina has one of the lowest property tax rates in the country at 0.57% average effective rate, significantly below the national average of 1.1%.',
  },
}

export const gaConfig: StateConfig = {
  slug: 'georgia',
  stateName: 'Georgia',
  stateAbbr: 'GA',
  avgPropertyTaxRate: 0.92,
  avgHomeInsurance: 1500,
  avgHomePrice: 330000,
  majorCities: ['Atlanta', 'Savannah', 'Augusta', 'Athens'],
  firstTimeBuyerProgram: {
    name: 'Georgia Dream Homeownership Program',
    url: 'https://www.dca.ga.gov/safe-affordable-housing/homeownership',
  },
  contentBlurbs: {
    marketOverview:
      "Georgia's housing market is anchored by Atlanta, one of the fastest-growing metro areas in the country. Outside Atlanta, markets like Savannah, Augusta, and Athens offer considerably more affordable options with strong quality of life.",
    taxContext:
      "Georgia's average effective property tax rate is 0.92%, slightly below the national average of 1.1%.",
  },
}

export const flConfig: StateConfig = {
  slug: 'florida',
  stateName: 'Florida',
  stateAbbr: 'FL',
  avgPropertyTaxRate: 0.89,
  avgHomeInsurance: 2400,
  avgHomePrice: 410000,
  majorCities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
  firstTimeBuyerProgram: {
    name: 'Florida Hometown Heroes Program',
    url: 'https://floridahousingheroeshelp.gov',
  },
  contentBlurbs: {
    marketOverview:
      'Florida is one of the fastest-growing states in the country, driven by no state income tax, warm weather, and strong job growth in Tampa, Orlando, and Miami. Median home prices have risen sharply since 2020, with Miami and coastal markets exceeding $500,000 and inland markets like Orlando and Jacksonville remaining more accessible.',
    taxContext:
      'Florida has no state income tax, which helps offset its property tax rate of around 0.89% — close to the national average. However, homeowners insurance in Florida is significantly above the national average due to hurricane risk, often running $2,000–$4,000 per year depending on location and coverage.',
  },
  metaTitle: 'Florida Mortgage Calculator — FL Tax & Insurance Rates | FinWiser',
  metaDescription:
    'Free Florida mortgage calculator with FL average property tax and hurricane insurance costs pre-loaded. Estimate your true monthly payment including taxes, insurance, and PMI.',
}

export const txConfig: StateConfig = {
  slug: 'texas',
  stateName: 'Texas',
  stateAbbr: 'TX',
  avgPropertyTaxRate: 1.60,
  avgHomeInsurance: 1900,
  avgHomePrice: 340000,
  majorCities: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
  firstTimeBuyerProgram: {
    name: 'My First Texas Home Program',
    url: 'https://www.tdhca.state.tx.us/homeownership/fthb',
  },
  contentBlurbs: {
    marketOverview:
      'Texas has one of the largest and most diverse housing markets in the country. Austin saw dramatic price appreciation through 2022 and has since cooled, while Dallas, Houston, and San Antonio remain relatively affordable for their size. Texas has no state income tax, which attracts significant relocation from higher-tax states.',
    taxContext:
      "Texas has one of the highest property tax rates in the country at around 1.60% — nearly 50% above the national average of 1.1%. This meaningfully increases monthly payments compared to neighboring states, making it especially important to include taxes in your mortgage estimate.",
  },
  metaTitle: 'Texas Mortgage Calculator — High Property Tax Rates Included | FinWiser',
  metaDescription:
    "Free Texas mortgage calculator with TX property tax rates pre-loaded. Texas has some of the highest property taxes in the US — see how they affect your monthly payment.",
  topCallout: {
    heading: 'Texas Property Tax Warning',
    body: "Texas has no state income tax but property taxes average 1.60% — one of the highest rates in the US. On a $340,000 home that's roughly $453/month added to your mortgage payment. Make sure you include taxes in your estimate or you'll significantly underestimate your true monthly cost.",
  },
}

export const vaConfig: StateConfig = {
  slug: 'virginia',
  stateName: 'Virginia',
  stateAbbr: 'VA',
  avgPropertyTaxRate: 0.82,
  avgHomeInsurance: 1100,
  avgHomePrice: 390000,
  majorCities: ['Northern Virginia', 'Richmond', 'Virginia Beach', 'Charlottesville', 'Roanoke'],
  firstTimeBuyerProgram: {
    name: 'Virginia Housing Down Payment Assistance Grant',
    url: 'https://www.virginiahousing.com',
  },
  contentBlurbs: {
    marketOverview:
      "Virginia's housing market is heavily shaped by the Northern Virginia suburbs of Washington DC, where home prices routinely exceed $600,000 and competition is intense. Richmond, Virginia Beach, and Charlottesville offer more moderate prices with strong quality of life. Virginia also has one of the highest concentrations of VA loan eligible buyers in the country due to its large military population.",
    taxContext:
      "Virginia's average effective property tax rate is 0.82%, below the national average of 1.1%. However, Northern Virginia localities like Fairfax and Arlington have higher effective rates due to high assessed home values, so actual tax costs vary significantly by location.",
  },
  metaTitle: 'Virginia Mortgage Calculator — VA Loan & Local Rates | FinWiser',
  metaDescription:
    'Free Virginia mortgage calculator with VA average property tax rates pre-loaded. Includes info on VA loans and Northern Virginia home prices.',
  extraSections: [
    {
      heading: 'VA Loans in Virginia',
      paragraphs: [
        "Virginia has one of the highest concentrations of VA loan-eligible buyers in the country, with a large active duty and veteran military population near bases like Quantico, Fort Belvoir, and Naval Station Norfolk. VA loans — backed by the U.S. Department of Veterans Affairs, not the state — are one of the most powerful homebuying tools available to eligible buyers.",
        'Key VA loan features:',
      ],
      bullets: [
        'No down payment required',
        'No PMI required — saving hundreds per month compared to conventional financing',
        'Competitive interest rates, typically at or below conventional rates',
        'Available to eligible veterans, active duty service members, and surviving spouses',
      ],
      link: {
        text: 'Check VA loan eligibility at VA.gov',
        url: 'https://www.va.gov/housing-assistance/home-loans/',
      },
      note: 'This calculator estimates conventional loan payments. VA loan payments will differ — particularly with no down payment and no PMI requirement.',
    },
  ],
}

export const stateConfigs: StateConfig[] = [
  ncConfig, scConfig, gaConfig, flConfig, txConfig, vaConfig,
]

export function generateStateMortgageMetadata(config: StateConfig): Metadata {
  const title = config.metaTitle ?? `${config.stateName} Mortgage Calculator — ${config.stateAbbr} Tax Rates Included | FinWiser`
  const description = config.metaDescription ?? `Free ${config.stateName} mortgage calculator with ${config.stateAbbr} average property tax rates pre-loaded. Estimate your full monthly payment including taxes, insurance, and PMI.`
  const url = `https://finwiser.net/calculators/mortgage/${config.slug}`
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `${config.stateName} Mortgage Calculator — FinWiser` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}
