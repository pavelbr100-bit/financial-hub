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
    // Optional in-depth /learn guide, rendered in the Related Calculators & Guides list
    guideHref?: string
    guideLabel?: string
  }
  contentBlurbs: {
    marketOverview: string
    taxContext: string
    taxFaq: string
    priceFaq: string
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
    guideHref: '/learn/first-time-home-buyer-programs-nc',
    guideLabel: 'First-Time Home Buyer Programs in North Carolina',
  },
  contentBlurbs: {
    marketOverview:
      'North Carolina has seen strong population growth, particularly in the Research Triangle and Charlotte metro areas. Median home prices range from around $280,000 in smaller markets to over $400,000 in Raleigh and Charlotte.',
    taxContext:
      "North Carolina's average effective property tax rate is 0.77%, well below the national average of 1.1%, which helps keep monthly payments lower than many comparable states.",
    taxFaq:
      "Homeowners in North Carolina pay an effective property tax rate of about 0.77% of their home's assessed value each year — roughly 30% below the 1.1% national average. That difference shows up directly in your monthly escrow payment compared to higher-tax states.",
    priceFaq:
      "Home prices vary widely across North Carolina. Smaller markets can start around $280,000, while in-demand areas like Raleigh and Charlotte — both benefiting from strong population growth in the Research Triangle and Charlotte metro — often top $400,000. Plug a price from your target area into the calculator above to see NC-specific monthly costs.",
  },
  extraSections: [
    {
      heading: 'Closing Costs in North Carolina',
      paragraphs: [
        "North Carolina is an attorney state — meaning a licensed NC real estate attorney must supervise and conduct the closing. This is not optional; it's required by state law. Attorney fees typically run $750–$1,500, depending on the transaction complexity and firm. Budget for this on top of the standard closing cost components.",
        'Total closing costs in North Carolina generally run 2–3% of the purchase price, which includes:',
      ],
      bullets: [
        'Attorney fee: $750–$1,500',
        'Title search and title insurance: $500–$1,000',
        'Recording fees: $64 (deed) + $64 (deed of trust)',
        'Lender origination fee: varies (0–1% of loan amount)',
        'Prepaid interest, escrow setup, and homeowner\'s insurance premium',
      ],
      note: 'On a $320,000 purchase, closing costs often total $6,400–$9,600. Ask your lender for a Loan Estimate within 3 business days of applying — it breaks down every closing cost line by line.',
    },
  ],
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
    name: 'SC Housing Homebuyer Program',
    url: 'https://schousing.sc.gov',
    guideHref: '/learn/first-time-home-buyer-programs-south-carolina',
    guideLabel: 'First-Time Home Buyer Programs in South Carolina',
  },
  contentBlurbs: {
    marketOverview:
      'South Carolina offers some of the most affordable home prices in the Southeast. Charleston and Greenville have seen significant price appreciation, while Columbia and smaller markets remain highly accessible for first-time buyers.',
    taxContext:
      'South Carolina has one of the lowest property tax rates in the country at 0.57% average effective rate, significantly below the national average of 1.1%.',
    taxFaq:
      'At an average effective rate near 0.57%, South Carolina property taxes rank among the lowest in the country — roughly half the 1.1% national average. That keeps the tax portion of a monthly mortgage payment relatively small compared to most other states.',
    priceFaq:
      "South Carolina remains one of the more affordable states in the Southeast for buyers, though that's changing in popular spots — Charleston and Greenville have both seen sharp price growth in recent years. Columbia and the state's smaller markets are still relatively accessible, especially for first-time buyers. Enter a price from your target market into the calculator above for SC-specific monthly costs.",
  },
  extraSections: [
    {
      heading: 'Flood Insurance for South Carolina Coastal Homes',
      paragraphs: [
        'South Carolina\'s coastline — including Myrtle Beach, Hilton Head, the Sea Islands, and Charleston — runs through FEMA-designated Special Flood Hazard Areas (SFHAs). If your home is in a SFHA and you have a federally backed mortgage, flood insurance is required by law. Even outside SFHAs, many SC lenders require it for coastal properties.',
        'Standard homeowner\'s insurance does not cover flooding. Flood insurance is a separate policy, typically through FEMA\'s National Flood Insurance Program (NFIP) or a private insurer. Annual premiums vary widely:',
      ],
      bullets: [
        'Low-risk zones (Zone X): $400–$800/year — optional but worth having near the coast',
        'Moderate-risk zones (Zone AE): $1,000–$2,500/year — often required by lenders',
        'High-risk zones (Zone VE, coastal high-hazard): $2,500–$6,000+/year',
      ],
      note: 'The calculator above uses $1,600/year for homeowner\'s insurance — a reasonable estimate for inland SC. For coastal properties, add the flood insurance premium on top. Check the FEMA Flood Map Service Center to look up a specific property\'s flood zone.',
    },
  ],
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
    url: 'https://dca.georgia.gov',
    guideHref: '/learn/first-time-home-buyer-programs-georgia',
    guideLabel: 'First-Time Home Buyer Programs in Georgia',
  },
  contentBlurbs: {
    marketOverview:
      "Georgia's housing market is anchored by Atlanta, one of the fastest-growing metro areas in the country. Outside Atlanta, markets like Savannah, Augusta, and Athens offer considerably more affordable options with strong quality of life.",
    taxContext:
      "Georgia's average effective property tax rate is 0.92%, slightly below the national average of 1.1%. However, Georgia's homestead exemption program can meaningfully reduce the effective rate for primary-residence owners — see below.",
    taxFaq:
      "Georgia homeowners pay an average effective property tax rate of about 0.92% — just under the 1.1% national average. Primary residents can reduce that further through the state's homestead exemption program, which lowers the assessed value used to calculate the bill (details below).",
    priceFaq:
      "Atlanta drives much of Georgia's housing market and remains one of the fastest-growing metros in the country, which keeps upward pressure on prices there. Buyers looking for more affordable options with a strong quality of life often look to Savannah, Augusta, or Athens instead. The calculator above uses Georgia-specific tax defaults no matter which market you're comparing.",
  },
  extraSections: [
    {
      heading: "Georgia's Homestead Exemption Program",
      paragraphs: [
        "Georgia law requires counties to grant a basic homestead exemption to any homeowner who occupies their property as their primary residence as of January 1. The standard state exemption reduces the assessed taxable value of your home by $2,000 for the state portion of the tax bill — a modest but automatic benefit.",
        "The larger savings come from county-level exemptions, which vary significantly by location:",
      ],
      bullets: [
        'Fulton County: $30,000 homestead exemption on county taxes (plus additional exemptions for seniors)',
        'DeKalb County: $15,000 base exemption; up to $62,500 for seniors 62+',
        'Cobb County: $10,000 base exemption; additional options for seniors and disabled veterans',
        'Chatham County (Savannah): $10,000 base exemption on county portion',
        'Clarke County (Athens): standard exemption; full tax schedule available through county tax commissioner',
      ],
      note: 'To receive the exemption, you must apply through your county tax assessor\'s office by April 1 of the tax year — it is not applied automatically. Once approved, it renews each year as long as you maintain primary residency. New homeowners who miss the April 1 deadline must wait until the following year.',
    },
  ],
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
    taxFaq:
      "Florida's average effective property tax rate is around 0.89%, roughly in line with the 1.1% national average. The bigger cost gap for FL homeowners is insurance — hurricane risk pushes annual premiums to $2,000–$4,000 in many areas, well above what most other states pay.",
    priceFaq:
      "Florida's population growth — fueled by no state income tax, warm weather, and job growth in Tampa, Orlando, and Miami — has pushed home prices up sharply since 2020. Coastal markets like Miami now commonly exceed $500,000, while inland cities such as Orlando and Jacksonville remain comparatively accessible. The calculator above is pre-loaded with Florida's higher insurance costs so your estimate reflects the real cost of owning here.",
  },
  metaTitle: 'Florida Mortgage Calculator — FL Tax & Insurance | FinWiser',
  metaDescription:
    'Free Florida mortgage calculator with FL property tax and hurricane insurance costs pre-loaded. Estimate your true monthly payment including PMI.',
  topCallout: {
    heading: 'Florida Homeowners Insurance: Budget for the Real Cost',
    body: "Florida homeowners pay some of the highest insurance premiums in the country — typically $2,000–$4,000 per year for a standard home, and significantly more for coastal or older properties. Hurricane risk, a high-litigation environment, and reinsurance losses have pushed more than a dozen private carriers out of the state in recent years. The calculator is pre-loaded with $2,400/year, but get an actual insurance quote early — it's the line item most likely to diverge from the default.",
  },
  extraSections: [
    {
      heading: "Florida's Homestead Exemption and the Save Our Homes Cap",
      paragraphs: [
        "Florida provides two meaningful property tax benefits that reduce the tax portion of your mortgage payment over time — both exclusive to primary-residence homeowners.",
        "The Homestead Exemption reduces your home's taxable assessed value by up to $50,000. The first $25,000 applies to all taxing authorities (county, school, city); the second $25,000 applies to all taxes except school district levies. On a home assessed at $400,000, this typically saves $700–$1,400 per year depending on your combined local millage rate. To claim it, you must apply with your county property appraiser's office by March 1 of the tax year — it is not automatic for new owners.",
        "Once you qualify, the Save Our Homes (SOH) cap limits annual increases in your home's assessed value to 3% or the rate of inflation (CPI), whichever is lower. For homeowners who have held a homestead property for several years, the SOH cap can mean the assessed value is well below market value — and the tax bill substantially lower than what a new buyer of the same home would face.",
      ],
      bullets: [
        'First $25,000 exemption: applies to all taxing authorities',
        'Second $25,000 exemption: applies to all taxes except school district',
        'Save Our Homes cap: assessed value grows no more than 3%/year after you qualify',
        'Portability: when you sell and buy in FL, you can transfer up to $500,000 of accumulated SOH benefit to your next home',
        'Application deadline: March 1 — apply through your county property appraiser\'s office',
      ],
      note: "The 0.89% effective tax rate in the calculator reflects the statewide average across all homeowners, including those who already benefit from the exemption. Your actual effective rate after qualifying — especially in year two and beyond — may be noticeably lower.",
    },
    {
      heading: 'Windstorm and Flood Insurance in Florida',
      paragraphs: [
        "Standard homeowners insurance in Florida may not fully cover hurricane wind damage. Many policies include a separate windstorm deductible — typically 2–5% of the insured value rather than a flat dollar amount. On a $400,000 home, a 2% deductible means you pay the first $8,000 of any hurricane-related wind damage before coverage applies.",
        "Flood insurance is separate from homeowners insurance and is required by lenders for homes in FEMA-designated Special Flood Hazard Areas (SFHAs). Florida has more active NFIP policies than any other state. Premiums vary widely by flood zone and elevation:",
      ],
      bullets: [
        'Zone X (minimal risk): $400–$900/year — optional but common near the coast',
        'Zone AE (100-year floodplain): $1,000–$3,000/year — typically lender-required',
        'Zone VE (coastal high-hazard, wave action): $3,000–$8,000+/year',
      ],
      link: {
        text: "Look up any property's flood zone on the FEMA Map Service Center",
        url: 'https://msc.fema.gov',
      },
      note: "The $2,400 homeowners insurance default covers a typical inland Florida home. Coastal buyers should budget separately for a windstorm deductible risk and, if in a SFHA, a flood insurance premium — these can add hundreds to thousands per year.",
    },
  ],
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
    taxFaq:
      "At roughly 1.60%, Texas property tax rates run about 50% above the 1.1% national average — among the highest in the country. Because that tax is escrowed into your monthly payment, leaving it out of a mortgage estimate can understate your true monthly cost by a wide margin.",
    priceFaq:
      "Texas has one of the largest, most varied housing markets in the country. Austin's prices climbed sharply through 2022 and have since leveled off, while Dallas, Houston, and San Antonio remain relatively affordable for their size — a draw for the steady stream of relocations from higher-tax states. Whichever market you're considering, Texas's high property tax rate (above) has an outsized effect on the monthly payment estimate.",
  },
  metaTitle: 'Texas Mortgage Calculator — High Property Taxes | FinWiser',
  metaDescription:
    "Free Texas mortgage calculator with TX property tax rates pre-loaded. Texas has some of the highest property taxes in the US — see the monthly impact.",
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
    taxFaq:
      "Statewide, Virginia's average effective property tax rate is about 0.82%, below the 1.1% national average. That figure can be misleading for buyers in Fairfax, Arlington, and other Northern Virginia localities, where high assessed home values push the actual tax bill well above the statewide average.",
    priceFaq:
      "Home prices in Virginia vary enormously by region. Northern Virginia's DC suburbs are among the most competitive markets in the country, with prices routinely topping $600,000, while Richmond, Virginia Beach, and Charlottesville offer considerably more moderate price points. If you're an eligible veteran or active-duty service member, see the VA loan section below — Virginia has one of the highest concentrations of VA-eligible buyers in the country.",
  },
  metaTitle: 'Virginia Mortgage Calculator — VA Loan & Rates | FinWiser',
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
  // Both fallbacks are kept short enough that the longest state name ("North Carolina")
  // still lands under 60 chars for the title and 160 for the description.
  const title = config.metaTitle ?? `${config.stateName} Mortgage Calculator — ${config.stateAbbr} Tax Rates | FinWiser`
  const description = config.metaDescription ?? `Free ${config.stateName} mortgage calculator with ${config.stateAbbr} property tax rates pre-loaded. Estimate your full monthly payment with taxes, insurance, and PMI.`
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
