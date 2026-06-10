#!/usr/bin/env node
/**
 * verify-article-math.mjs
 * Standalone amortization verifier for FinWiser article claims.
 * Run: node scripts/verify-article-math.mjs
 *
 * Add new claims to the CLAIMS array as articles are written/edited.
 * Each claim prints expected vs computed so drift is obvious at a glance.
 */

function monthlyPayment(principal, annualRatePct, years) {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

/** Simulate payoff with optional extra monthly principal. */
function simulate(principal, annualRatePct, payment, extra = 0) {
  const r = annualRatePct / 100 / 12;
  let bal = principal,
    months = 0,
    interest = 0;
  while (bal > 0 && months < 1200) {
    const i = bal * r;
    interest += i;
    bal -= payment + extra - i;
    months++;
  }
  return { months, years: months / 12, interest };
}

const fmt = (n) => '$' + Math.round(n).toLocaleString('en-US');
const yrs = (n) => n.toFixed(1) + ' yrs';

function check(label, computed, articleSays, tolerancePct = 3) {
  const pass =
    typeof computed === 'number' && typeof articleSays === 'number'
      ? Math.abs(computed - articleSays) / articleSays <= tolerancePct / 100
      : null;
  const flag = pass === null ? 'ℹ️ ' : pass ? '✅' : '❌';
  console.log(
    `${flag} ${label}\n     computed: ${
      typeof computed === 'number' ? fmt(computed) : computed
    }   article: ${typeof articleSays === 'number' ? fmt(articleSays) : articleSays}\n`
  );
}

console.log('=== FinWiser article math verification ===\n');

// ---------------------------------------------------------------
// learn/mortgage-payoff-strategies
// ---------------------------------------------------------------
console.log('--- learn/mortgage-payoff-strategies ---\n');

// Intro: $300K @ 7% / 30yr total interest
{
  const p = monthlyPayment(300000, 7, 30);
  const { interest } = simulate(300000, 7, p);
  check('Intro: total interest on $300K @7%/30yr (use "nearly $420,000")', interest, 420000);
}

// Strategy 1: $350K @ 6.5% / 30yr — one-twelfth extra
{
  const p = monthlyPayment(350000, 6.5, 30);
  console.log(`ℹ️  Strategy 1: P&I on $350K @6.5%/30yr = ${fmt(p)}/mo; one-twelfth = ${fmt(p / 12)}/mo (article must say $184, NOT $244)\n`);
  const base = simulate(350000, 6.5, p);
  const extra = simulate(350000, 6.5, p, p / 12);
  check('Strategy 1: payoff term with 1/12 extra (~24 yrs)', extra.years, 24, 5);
  check('Strategy 1: interest saved with 1/12 extra (use ~$102,000)', base.interest - extra.interest, 102000);
}

// Strategy 3: $300K @ 7% / 30yr + $100/mo
{
  const p = monthlyPayment(300000, 7, 30);
  const base = simulate(300000, 7, p);
  const extra = simulate(300000, 7, p, 100);
  check('Strategy 3: years cut with +$100/mo (~4 yrs)', base.years - extra.years, 4.2, 10);
  check('Strategy 3: interest saved with +$100/mo (use ~$69,000)', base.interest - extra.interest, 69000);
}

// Strategy 5: 30yr @7% vs 15yr @6.5% on $300K
{
  const p30 = monthlyPayment(300000, 7, 30);
  const p15 = monthlyPayment(300000, 6.5, 15);
  check('Strategy 5: 15yr payment (~$2,613)', p15, 2613, 1);
  const i30 = p30 * 360 - 300000;
  const i15 = p15 * 180 - 300000;
  check('Strategy 5: interest difference (use ~$248,000, NOT $190,000)', i30 - i15, 248000);
}

// Strategy 6: recast — $280K @6.5%, 20yr left, $40K lump
{
  const before = monthlyPayment(280000, 6.5, 20);
  const after = monthlyPayment(240000, 6.5, 20);
  check('Strategy 6: recast payment drop (~$300/mo)', before - after, 300, 5);
}

// Strategy 7: PMI — $175/mo redirected on $280K @6.5%, ~20yr remaining
{
  const p = monthlyPayment(280000, 6.5, 20);
  const base = simulate(280000, 6.5, p);
  const extra = simulate(280000, 6.5, p, 175);
  check('Strategy 7: years cut (~3 yrs)', base.years - extra.years, 2.8, 15);
  check('Strategy 7: interest saved (~$35,000)', base.interest - extra.interest, 35000, 10);
}

// FAQ: biweekly on $300K @7%/30yr
{
  const p = monthlyPayment(300000, 7, 30);
  const base = simulate(300000, 7, p);
  const bi = simulate(300000, 7, p, p / 12); // biweekly ≈ one extra payment/yr
  check('FAQ biweekly: interest saved (use ~$100,000, NOT $40-50K)', base.interest - bi.interest, 102000);
  check('FAQ biweekly: years early (use ~6 yrs, NOT 4-5)', base.years - bi.years, 6.2, 10);
}

// ---------------------------------------------------------------
// State mortgage pages — P&I tables (7%, 30yr, 20% down)
// ---------------------------------------------------------------
console.log('--- state pages: P&I tables @7%/30yr ---\n');
const stateTableLoans = [
  { loan: 204800, claimed: 1363 }, // NC $256K home
  { loan: 256000, claimed: 1703 }, // NC $320K home
  { loan: 320000, claimed: 2129 }, // NC $400K home
];
for (const { loan, claimed } of stateTableLoans) {
  check(`State table: P&I on ${fmt(loan)} loan`, monthlyPayment(loan, 7, 30), claimed, 1);
}

console.log('Done. ❌ = article text must change. ℹ️ = reference value.');
