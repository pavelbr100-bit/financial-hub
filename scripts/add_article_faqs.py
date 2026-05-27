import os, re

BASE = '/Users/pavelborishkevich/Apps/financial-hub/app/learn'

FAQS = {
    'mortgage-payoff-strategies': [
        ("How do extra mortgage payments work?",
         "Extra payments applied to a mortgage go directly toward the principal balance. This reduces the outstanding amount, which means less interest accrues the following month, and more of every future regular payment goes toward principal instead of interest. Over time this compounding effect can shave years off the loan and save tens of thousands of dollars."),
        ("How much can I save by making one extra mortgage payment per year?",
         "On a typical 30-year mortgage, making just one extra payment per year usually cuts the loan term by 4 to 6 years and saves $40,000 to $100,000 in interest, depending on your loan balance and rate. The earlier in the loan you start, the greater the savings because you avoid more years of interest accrual on that reduced balance."),
        ("What is the best strategy to pay off a mortgage early?",
         "The best strategy depends on your budget flexibility. Biweekly payments and rounding up your monthly payment by $100 to $200 are low-effort and highly effective. Applying annual windfalls like tax refunds to principal makes a big dent. Refinancing to a 15-year mortgage is the most aggressive option but requires higher monthly payments. Many homeowners combine two or more of these strategies for maximum impact."),
        ("Do biweekly mortgage payments really save money?",
         "Yes. Biweekly payments are mathematically equivalent to making 13 monthly payments per year instead of 12. That extra payment goes entirely toward principal, which reduces the balance faster and cuts interest costs. On a $300,000 30-year mortgage at 7%, biweekly payments typically save $40,000 to $50,000 in interest and pay off the loan 4 to 5 years earlier than scheduled."),
        ("Does paying extra on mortgage principal actually reduce interest?",
         "Yes. Mortgage interest is calculated on the outstanding balance each month. When you make an extra principal payment the balance drops, and every future payment accrues slightly less interest. This effect compounds over time: a smaller balance today means less interest next month, which means more of next month's payment reduces the balance further, and so on for the remainder of the loan."),
    ],
    'compound-interest-guide': [
        ("What is the difference between simple and compound interest?",
         "Simple interest is calculated only on the original principal. Compound interest is calculated on the principal plus any previously earned interest, meaning interest earns interest. Over long periods the difference is dramatic. A $10,000 investment earning 7% simple interest grows to $20,000 in 14 years; with compound interest it grows to roughly $25,000 over the same period."),
        ("How often does compound interest compound?",
         "Compounding frequency varies by account or investment type. Savings accounts and money market accounts typically compound daily or monthly. CDs often compound semiannually or annually. The more frequently interest compounds, the faster your balance grows, though the practical difference between daily and monthly compounding is small at typical savings rates. What matters far more is the rate itself and how long you leave the money invested."),
        ("How long does it take to double money with compound interest?",
         "The Rule of 72 gives a quick estimate: divide 72 by your annual interest rate. At 6%, your money doubles in about 12 years. At 8%, it doubles in 9 years. At 10%, in about 7 years. This is why starting early matters enormously. Time is the most powerful variable in compound interest, and waiting even a few extra years to start investing can cost far more than contributing a larger amount later."),
        ("Does starting early really matter that much for compound interest?",
         "Enormously. Investing $5,000 per year from age 25 to 65 at 7% compounds to roughly $1.1 million. Starting at 35 and contributing the same amount over 30 years yields only about $540,000, despite contributing just $50,000 less in total. Those 10 extra years of compounding account for a difference of over $560,000. No other variable in personal finance has as large an impact as the number of years your money compounds."),
        ("What is the Rule of 72 in investing?",
         "The Rule of 72 is a mental shortcut for estimating how long an investment takes to double. Divide 72 by the expected annual return rate. At 9% annual returns, the investment doubles in 8 years. It works in reverse too: to find the return needed to double money in a given number of years, divide 72 by the number of years. To double money in 10 years requires roughly 7.2% annual returns. It is an approximation, but a remarkably accurate one for rates in the 5 to 15% range."),
    ],
    'debt-avalanche-vs-snowball': [
        ("What is the debt avalanche method?",
         "The debt avalanche method prioritizes paying off your highest-interest-rate debt first while making minimum payments on all others. Once the highest-rate debt is paid off, you roll that payment toward the next highest-rate debt, and so on. Mathematically this minimizes total interest paid across all your debts and is the fastest way to become debt-free in terms of total dollars spent."),
        ("What is the debt snowball method?",
         "The debt snowball method pays off your smallest-balance debt first, regardless of interest rate, while paying minimums on everything else. Once the smallest debt is gone, you roll that payment to the next smallest balance. This approach generates quick wins that build momentum and motivation, which is why it tends to work well for people who have struggled to stay consistent with debt repayment in the past."),
        ("Which debt payoff method saves the most money, avalanche or snowball?",
         "The debt avalanche saves more money in total interest because it targets high-rate debt first. The difference can be substantial if your debts have very different interest rates. For example, if you have a 24% credit card and a 6% personal loan, the avalanche saves significantly more than the snowball. If your debts have similar rates, the difference between the two methods is minimal and the choice comes down to personal preference."),
        ("How do I choose between the debt avalanche and debt snowball?",
         "Choose avalanche if you want to minimize total interest paid and can stay motivated without early wins. Choose snowball if you have tried and failed to pay off debt before, need the psychological boost of eliminating entire accounts, or have a debt with a very small balance that the avalanche would leave sitting for months. Many financial advisors say the best method is whichever one you will actually stick with consistently."),
        ("How long does it take to pay off debt using these methods?",
         "The timeline depends on your total debt, interest rates, and how much extra you can put toward debt each month beyond minimums. Adding $200 to $300 per month extra can cut a 5-year payoff timeline down to 3 years. Both avalanche and snowball produce similar total payoff timelines. The main difference between them is the total interest paid and which specific debts disappear first along the way."),
    ],
    'what-is-amortization': [
        ("What is an amortization schedule?",
         "An amortization schedule is a table showing every payment on a loan, including how much goes to interest, how much reduces the principal balance, and the remaining balance after each payment. It maps the entire life of the loan from the first payment to the last. Reviewing your amortization schedule reveals the true cost of borrowing and shows exactly how extra payments change your payoff date and total interest cost."),
        ("How is an amortization schedule calculated?",
         "Each row uses the outstanding balance and the monthly interest rate. Interest for the period equals balance multiplied by the annual rate divided by 12. Principal paid equals the fixed monthly payment minus that interest. The new balance equals the previous balance minus the principal paid. This repeats for every period until the balance reaches zero. Because the balance is highest at the start, early payments are mostly interest and only a small portion reduces the principal."),
        ("Why do I pay so much interest at the beginning of a loan?",
         "Loan interest is calculated on the outstanding balance. At the start of the loan the balance is at its maximum, so the interest charge for that period is the highest it will ever be. As you pay down principal over time the balance drops, and each month's interest charge shrinks. This front-loading of interest is built into how amortization works and applies equally to mortgages, car loans, and personal loans."),
        ("Can I get an amortization schedule for my mortgage?",
         "Yes. Your lender is required to provide an amortization schedule on request, and most loan servicer portals display one online. You can also generate one instantly with an amortization calculator: enter your loan amount, interest rate, and term and the full payment-by-payment schedule is computed automatically. FinWiser's free loan amortization calculator generates a complete schedule for any loan type."),
        ("What happens to my amortization schedule if I make extra payments?",
         "Extra payments applied to principal shorten the amortization schedule: you reach a zero balance before the original end date. Each extra payment eliminates future interest charges from every remaining row in the schedule. The required monthly payment stays the same; what changes is the total number of payments you end up making. Use an amortization calculator to see exactly how much any extra payment shortens your specific loan."),
    ],
    'mortgage-amortization-explained': [
        ("Why do I pay mostly interest at the start of my mortgage?",
         "Mortgage interest is charged on the outstanding balance each month. At the beginning of a 30-year mortgage the balance is at its full amount, so the interest portion of each payment is at its maximum. As you pay down principal over the years the balance shrinks, interest charges decrease, and more of each payment goes toward principal. This pattern is a mathematical consequence of how amortization works, not a fee or a penalty from the lender."),
        ("How does mortgage amortization work?",
         "Amortization spreads loan repayment evenly across a fixed number of payments. Each payment covers the month's interest, which is the balance multiplied by the monthly rate, plus a portion of principal. Because the balance decreases each month the interest portion gradually shrinks and the principal portion grows. Your payment amount stays the same throughout the loan, but its composition shifts from mostly interest at the start to mostly principal near the end."),
        ("How much of my mortgage payment goes to principal in the early years?",
         "In the first year of a 30-year mortgage at 7%, roughly 12 to 15 percent of each payment reduces the principal. The rest is interest. By year 10 about 25 to 30 percent goes to principal. By year 20 it is roughly 50 percent. In the final year nearly the entire payment is principal. The exact split depends on your interest rate and loan term; higher rates mean even more of early payments go to interest."),
        ("Does making extra payments change my amortization schedule?",
         "Yes. Extra principal payments shorten the amortization schedule by reducing the outstanding balance, which reduces future interest charges. The required monthly payment stays the same, but you reach payoff sooner. Even small consistent extras like $100 per month can cut several years off a 30-year mortgage. A mortgage calculator lets you see exactly how your specific extra payment amount changes your payoff date and total interest cost."),
        ("What is negative amortization on a mortgage?",
         "Negative amortization occurs when a monthly payment is too small to cover even the interest due, so the unpaid interest gets added to the loan balance. This means the balance grows over time instead of shrinking. Negative amortization loans were common in the early 2000s with certain adjustable-rate products but are now rare. They are risky for borrowers because you can end up owing more than you originally borrowed."),
    ],
    'avalanche-vs-snowball-debt-payoff': [
        ("What is the avalanche method for paying off debt?",
         "The debt avalanche method directs all extra payment money toward the debt with the highest interest rate first, while maintaining minimum payments on everything else. Once that debt is eliminated, the freed-up payment moves to the next highest-rate debt. This approach minimizes the total interest you pay, making it the mathematically optimal strategy for spending as little as possible to become debt-free."),
        ("What is the snowball method for paying off debt?",
         "The debt snowball method pays off the smallest balance first, regardless of interest rate, while maintaining minimums on all other debts. After the smallest debt is gone, that payment rolls into the next smallest. The strategy creates rapid wins early on, and seeing debts disappear completely provides a psychological boost that helps many people stay motivated and on track with their repayment plan."),
        ("Is the debt avalanche or debt snowball method better?",
         "It depends on your personality and financial situation. The avalanche saves more money on interest, often thousands of dollars, and is better if you can stay disciplined without quick wins. The snowball can cost more in interest but produces early victories that help many people maintain momentum. Research on behavioral economics suggests the snowball's psychological wins lead to better long-term outcomes for people who have struggled to pay off debt consistently in the past."),
        ("How do I start the debt avalanche method?",
         "List all your debts with their balances, minimum payments, and interest rates. Order them by interest rate from highest to lowest. Pay the minimum on every debt, then put every extra dollar toward the top of the list. When the highest-rate debt is paid off, add its former payment to the next debt on the list. Repeat until all debts are gone. A debt payoff calculator makes it easy to see your exact payoff date and total interest cost under this approach."),
        ("Can I switch from the snowball to the avalanche method mid-way?",
         "Yes, you can switch at any time with no penalty or reset. If you started with the snowball to build momentum but now want to focus on reducing interest costs, simply reorder your payoff list by interest rate and continue from there. Some people use a deliberate hybrid: snowball for the first two or three small debts to build confidence, then switch to avalanche for the remaining larger balances where the rate differences matter most."),
    ],
    'how-much-house-can-you-afford': [
        ("What is the 28/36 rule for buying a home?",
         "The 28/36 rule is a lender guideline for home affordability. The 28 means your monthly housing costs, including mortgage principal and interest, property taxes, and insurance, should not exceed 28% of your gross monthly income. The 36 means your total monthly debt payments, including housing plus car loans, student loans, credit cards, and other recurring debts, should not exceed 36% of gross income. Most lenders use these thresholds to evaluate mortgage applications."),
        ("How much house can I afford on a $100,000 salary?",
         "Using the 28% rule, your maximum monthly housing payment on a $100,000 salary would be roughly $2,333. Assuming a 7% mortgage rate, a 30-year term, and 10% down, that translates to roughly $280,000 to $320,000 in home price depending on property taxes and insurance in your area. A larger down payment or a lower interest rate increases your buying power, while high existing debts reduce it."),
        ("What percentage of income should go to a mortgage payment?",
         "Lenders typically use 28% of gross monthly income as the maximum for housing costs. However, this is a ceiling, not a target. Many financial advisors suggest keeping housing costs at 25% or below to leave room for savings and unexpected expenses. Your individual situation matters too. If you carry high student loans or plan significant near-term expenses, keeping housing costs closer to 20 to 22% gives you considerably more financial breathing room."),
        ("What counts as debt in the 36% rule?",
         "The 36% back-end debt-to-income ratio includes all recurring monthly debt obligations: your proposed mortgage payment including taxes and insurance, car loans, student loans, minimum credit card payments, personal loans, and any child support or alimony. It does not include utilities, groceries, subscriptions, phone bills, or other variable living expenses. Only fixed contractual debt obligations are counted."),
        ("Does the 28/36 rule factor in a down payment?",
         "The 28/36 rule applies to your monthly payment, not the purchase price directly. A larger down payment reduces your loan amount, which lowers your monthly payment and effectively lets you afford a more expensive home while staying within the 28% limit. Down payments also affect PMI: going below 20% down typically adds private mortgage insurance to your monthly costs, which counts toward the 28% housing expense limit."),
    ],
    'what-is-compound-interest': [
        ("What is compound interest in simple terms?",
         "Compound interest is interest that earns interest. When you save or invest money, you earn interest on your principal. In the next period, you earn interest on the principal plus the interest you already earned. Over time this snowball effect causes your balance to grow faster and faster. The same mechanic works in reverse for debt: unpaid interest gets added to your balance, and in the next period you owe interest on that larger amount."),
        ("How does compound interest grow over time?",
         "Compound interest grows slowly at first and then accelerates dramatically. The first few years of a $10,000 investment at 7% add only a few hundred dollars per year. But after 20 years the balance has grown to about $38,700, adding nearly $2,700 that year alone. After 30 years the balance reaches about $76,000, adding roughly $5,000 per year. The later years do most of the heavy lifting, which is why patience and time in the market matter so much."),
        ("What is the difference between compound and simple interest?",
         "Simple interest is calculated only on the original principal. Compound interest is calculated on principal plus all previously accumulated interest. For a $1,000 investment at 10% over 5 years: simple interest earns a flat $100 per year for $500 total. Compound interest earns $100, then $110, then $121, then $133, then $146, totaling $610. The gap between them grows larger every single year the money stays invested."),
        ("How does compound interest work on a savings account?",
         "Banks calculate and credit interest to your balance periodically, usually daily or monthly. The next calculation uses your new, slightly higher balance. Your annual percentage yield, or APY, reflects the effective annual return after compounding is factored in. A savings account with a 5% nominal rate compounding daily has an APY slightly above 5%. The practical difference is small on short timelines but adds up meaningfully over many years."),
        ("Can compound interest work against you?",
         "Yes, and it is just as powerful on debt as on investments. Credit card balances that carry unpaid interest have that interest added to the balance, which is then charged interest the next period. A $5,000 credit card balance at 22% APR with only minimum payments could take 15 or more years to pay off and cost $8,000 to $10,000 in total interest charges. This is why high-rate revolving debt is so financially destructive and should be paid off as aggressively as possible."),
    ],
    'extra-mortgage-payments-how-much-can-you-save': [
        ("How much do extra mortgage payments really save?",
         "The savings depend on your loan balance, rate, and how much extra you pay. On a $300,000 30-year mortgage at 7%, paying an extra $100 per month saves roughly $44,000 in interest and cuts about 4 years off the loan. Paying an extra $200 per month saves about $72,000 and cuts 7 years. Paying an extra $500 per month saves over $120,000 and cuts more than 12 years. Every dollar of extra principal payment saves multiple dollars in future interest."),
        ("Is it worth making extra mortgage payments?",
         "It depends on your interest rate and alternative uses for the money. Extra mortgage payments are effectively a guaranteed return equal to your mortgage rate. At 7%, every dollar you pay reduces future interest at 7%. If your mortgage rate is low and you can reliably earn more by investing, investing may come out ahead mathematically. At higher rates of 6 to 8% or above, extra mortgage payments often beat low-risk alternatives. There is also real non-financial value in owning your home free and clear sooner."),
        ("What happens when you pay extra on mortgage principal?",
         "When you designate a payment as extra principal, it reduces your outstanding balance immediately. Because mortgage interest is calculated on the balance each month, a lower balance means less interest accrues the next month and every month after. The required monthly payment stays fixed; what changes is that you reach payoff sooner. The extra principal also builds equity faster, which matters if you plan to sell or refinance."),
        ("Should I pay extra on my mortgage or invest the money?",
         "This is one of the most common personal finance dilemmas, and the answer depends on your mortgage rate and risk tolerance. At historically low rates like 3 to 4%, money invested in a diversified index fund has historically outperformed early mortgage payoff over long periods. At higher rates like 6 to 8%, paying down mortgage debt becomes more competitive. A practical approach: contribute to retirement accounts first, especially to capture any employer match, then direct remaining surplus toward the mortgage."),
        ("How much does $200 extra per month save on a mortgage?",
         "On a $300,000 30-year mortgage at 7%, adding $200 per month in extra principal payments saves approximately $72,000 in total interest and shortens the loan by about 7 years. On a $400,000 mortgage at the same rate the savings are roughly $85,000 to $90,000, cutting about 6 to 7 years. Use a mortgage calculator to enter your exact numbers. The savings on larger balances or higher-rate loans are proportionally greater."),
    ],
    '15-year-vs-30-year-mortgage': [
        ("What is the main difference between a 15-year and 30-year mortgage?",
         "The core difference is the repayment term. You pay off the same loan in 15 years instead of 30, which means a higher required monthly payment but far less total interest. The 15-year mortgage also typically carries a lower interest rate, usually 0.5 to 0.75 percentage points below a 30-year, because shorter loans carry less risk for lenders. The 30-year offers a lower required payment and more budget flexibility but costs significantly more in total interest over the life of the loan."),
        ("Is a 15-year mortgage worth it?",
         "A 15-year mortgage is worth it if you can comfortably afford the higher payment without straining your monthly budget or sacrificing retirement savings. The interest savings are substantial, often $100,000 to $200,000 on a typical mortgage, and you build equity much faster. The risk is that the higher required payment creates less budget flexibility if your income drops. If the payment difference is tight, a 30-year mortgage with voluntary extra payments offers similar benefits with more financial flexibility."),
        ("How much more do you pay in total on a 30-year versus a 15-year mortgage?",
         "The difference in total interest is striking. On a $300,000 mortgage at recent rates around 7% for a 30-year and 6.5% for a 15-year, the 30-year costs roughly $418,000 in total interest over the life of the loan. The 15-year costs about $186,000. That is a difference of roughly $232,000 in extra interest. The 30-year payment is about $700 per month less than the 15-year, but you pay it for twice as long."),
        ("What are the pros and cons of a 15-year mortgage?",
         "Pros: dramatically less interest paid over the loan's life, you own the home outright in half the time, a lower interest rate than a 30-year, faster equity building, and a natural savings discipline. Cons: the required monthly payment is typically 40 to 50 percent higher than the equivalent 30-year mortgage, there is less budget flexibility for unexpected income changes, and the higher payment can make qualifying more difficult. The 15-year is ideal when the payment fits comfortably within the 28/36 affordability guidelines."),
        ("Can I pay off a 30-year mortgage in 15 years with extra payments?",
         "Yes, and this is a popular strategy. You take the 30-year mortgage for its lower required payment and flexibility, but pay enough extra principal each month to approximate what a 15-year payment would be. If rates or income change, you can reduce or stop the extra payments and the loan continues normally at the lower 30-year payment amount. The main trade-off is that you lose the lower interest rate that comes with an actual 15-year loan, so you will pay somewhat more in total interest than a pure 15-year mortgage would cost."),
    ],
    'what-is-loan-amortization': [
        ("What is a loan amortization schedule?",
         "A loan amortization schedule is a complete table showing every payment over the life of a loan. Each row shows the payment number, the payment amount, how much goes to interest, how much reduces the principal, and the remaining balance after that payment. It is generated based on your loan amount, interest rate, and term, and it serves as the full roadmap for repayment from the first payment to the final one that brings the balance to zero."),
        ("How do you read an amortization schedule?",
         "Each row represents one payment period, usually one month. Look at the Interest column to see how much of that payment is the cost of borrowing, and the Principal column to see how much reduces your debt. Early rows will show high interest and low principal. Later rows reverse the pattern with low interest and high principal. The Balance column shows your remaining debt after each payment, which is useful for tracking equity and understanding your exact payoff date."),
        ("Why does the interest portion of payments decrease over time?",
         "Interest is calculated on the outstanding balance each period. As you pay down principal month after month the balance shrinks, and a smaller balance means less interest accrues. Because the total payment amount stays fixed, the share going to principal grows automatically as the interest portion shrinks. By the final years of a loan, nearly the entire payment goes to principal because the balance has been reduced so dramatically over the preceding years."),
        ("How does an amortization schedule change with extra payments?",
         "Extra principal payments reduce the outstanding balance earlier than scheduled, which means less interest accrues in subsequent periods, and the loan reaches a zero balance before the original end date. The required monthly payment amount does not change. What changes is the total number of payments you need to make. An amortization calculator lets you model exactly how any extra payment amount changes your payoff date and total interest cost."),
        ("What is the formula for calculating loan amortization?",
         "The monthly payment formula is M equals P times r times (1 plus r) to the power of n, divided by (1 plus r) to the power of n minus 1, where P is the loan principal, r is the monthly interest rate which is the annual rate divided by 12, and n is the total number of monthly payments. For each period, interest equals balance times r, principal paid equals M minus interest, and new balance equals old balance minus principal paid. This calculation repeats for all n periods until the balance reaches zero."),
    ],
    'debt-payoff-strategies': [
        ("What is the fastest way to pay off debt?",
         "The fastest way is to maximize the amount you put toward your highest-interest debt each month while paying minimums on everything else, which is the avalanche method. Speed depends primarily on how much extra you can direct toward debt each month. Increasing income through a side job, cutting variable expenses, and applying windfalls like tax refunds and bonuses directly to debt all accelerate payoff. Consolidating multiple debts to a lower interest rate can also speed things up by reducing how much of each payment goes to interest."),
        ("How do I pay off $20,000 in debt quickly?",
         "Start by listing all debts with their balances, rates, and minimum payments. Calculate how much you can put toward debt above the minimums. Prioritize by interest rate for maximum savings or by balance for motivation. Reducing expenses to free up even $300 to $400 per month extra can pay off $20,000 in 4 to 5 years. Consider a balance transfer to a 0% APR card or a debt consolidation loan to reduce the rate. Avoid taking on any new debt while paying off existing balances."),
        ("Does debt consolidation help pay off debt faster?",
         "Consolidation helps if it reduces your interest rate, because more of each payment then goes to principal. Moving $15,000 from a 22% credit card to a 10% personal loan meaningfully accelerates payoff. However, if consolidation extends your loan term without reducing the monthly payment, it may cost more over time even with a lower rate. The key is to maintain or increase your monthly payment after consolidating, not use the lower required payment as an excuse to pay less each month."),
        ("What is a debt payoff plan and how do I create one?",
         "A debt payoff plan is a structured schedule showing the order and timeline for eliminating each of your debts. To create one, list all debts with balances, rates, and minimums; choose a method such as avalanche or snowball; calculate how much extra you can pay monthly; and project the payoff date for each debt. A debt payoff calculator automates this math and shows you exactly when each balance hits zero and how much total interest you will pay under any scenario."),
        ("How much extra should I pay on debt each month?",
         "Pay as much as you can while maintaining a small emergency fund of at least $1,000 to $2,000 to avoid going back into debt for unexpected expenses. A practical approach: pay minimums on all debts, then direct every available extra dollar toward your top-priority debt. Even $100 to $200 per month extra can significantly change your payoff timeline. Track your progress monthly and adjust when your income or expenses change."),
    ],
    'fixed-vs-variable-interest-rate': [
        ("What is the difference between a fixed and variable interest rate?",
         "A fixed interest rate stays the same for the entire loan term, so your payment never changes. A variable rate, also called an adjustable rate, can change periodically based on a benchmark index like the prime rate or SOFR. Variable rates typically start lower than fixed rates but carry the risk of rising over time. Fixed rates offer payment predictability; variable rates offer potential savings if interest rates stay low or decline during the loan term."),
        ("When is a variable interest rate a better choice than a fixed rate?",
         "A variable rate makes more sense when you plan to pay off the debt quickly before rates can rise significantly, when rates are high overall and likely to fall, or when you have the financial flexibility to absorb a payment increase. Short-term loans like 5-year car loans carry less variable-rate risk than a 30-year mortgage. For long-term loans where rate uncertainty could have a major impact on your budget, the certainty of a fixed rate is usually worth the slightly higher starting cost."),
        ("Can a variable rate loan be converted to a fixed rate?",
         "Some variable-rate loans include an option to convert to a fixed rate at certain points in the term, usually with a fee, though the offered fixed rate may not always be competitive. Alternatively, you can refinance a variable-rate loan into a new fixed-rate loan, which closes out the old loan and opens a new one. Refinancing comes with closing costs, so it is worth calculating how long it takes for the savings to exceed the upfront cost before proceeding."),
        ("What is a rate cap on a variable rate loan?",
         "A rate cap limits how much a variable interest rate can increase, either per adjustment period or over the life of the loan. For example, a 2/6 cap on an adjustable-rate mortgage means the rate cannot increase more than 2% at any single adjustment and cannot exceed the starting rate by more than 6% in total. Caps protect borrowers from extreme payment increases, but a loan near its ceiling can still see substantial payment rises if rates increase sharply over a short period."),
        ("Is a fixed or variable rate better for a mortgage?",
         "For most homebuyers, especially those taking out 30-year mortgages, a fixed rate provides the most security because your payment is locked in for the life of the loan regardless of rate movements. Variable-rate mortgages, known as ARMs, can make sense if you plan to sell or refinance within 5 to 7 years and want to benefit from the lower initial rate. ARMs carry real risk on longer time horizons because even modest rate increases can significantly raise monthly payments on a large mortgage balance."),
    ],
    'how-to-save-on-mortgage-interest': [
        ("How can I reduce the total interest I pay on my mortgage?",
         "The most impactful ways to reduce mortgage interest are to make extra principal payments regularly, refinance to a lower rate when rates drop meaningfully, make a larger down payment upfront to reduce the loan amount, choose a shorter loan term like 15 years instead of 30, and maintain excellent credit to qualify for the best available rates. Even small consistent extras like $100 to $200 per month toward principal can save tens of thousands over the life of a 30-year loan."),
        ("Does a higher down payment reduce mortgage interest?",
         "Yes, in two ways. First, a larger down payment means a smaller loan amount, so you pay interest on less money throughout the loan. Second, a down payment of 20% or more eliminates PMI, which reduces your monthly payment further. A higher down payment may also qualify you for a marginally lower interest rate, as lenders view lower loan-to-value loans as lower risk. The trade-off is the opportunity cost of that capital, since money used for a down payment cannot be invested elsewhere."),
        ("How does my credit score affect my mortgage interest rate?",
         "Your credit score has one of the largest single impacts on the rate you are offered. Borrowers with scores above 760 typically receive the best available rates. Each tier lower, at 740, 720, 700, and below 680, often adds 0.25 to 0.5 percentage points to the rate. On a $300,000 mortgage, a 1% rate difference amounts to roughly $60,000 to $70,000 in additional interest over 30 years. Improving your score before applying, even by 20 to 30 points, can meaningfully lower your lifetime interest cost."),
        ("Is it worth buying down your mortgage interest rate with points?",
         "Buying discount points means paying 1% of the loan amount upfront to reduce the interest rate by roughly 0.25%. Whether it is worth it depends on how long you will stay in the home. Divide the upfront cost by the monthly savings to find your break-even point, which is typically 5 to 8 years. If you plan to stay in the home longer than the break-even period, buying points saves money. If you might move or refinance before then, the upfront cost will not be recovered."),
        ("Can I negotiate a lower mortgage interest rate?",
         "Yes, and this is more common than most borrowers realize. Lenders have some discretion in rate setting, and presenting a competing offer from another lender often results in a match or a better offer. Working with a mortgage broker gives you access to rates from multiple lenders at once. You can also negotiate closing costs and point structures. Improving your credit score, reducing your debt-to-income ratio, and making a larger down payment all strengthen your position before applying."),
    ],
    'how-car-loan-interest-works': [
        ("How is interest calculated on a car loan?",
         "Most car loans use simple interest calculated on the outstanding principal balance each month. Interest for the period equals the balance multiplied by the annual rate divided by 12. The rest of your fixed monthly payment reduces the principal. Because the balance decreases with each payment, the interest portion shrinks over time. Early payments go mostly toward interest; later payments go mostly toward principal. This is why extra payments made early in the loan save more than the same payments made near the end."),
        ("Do car loans use simple or compound interest?",
         "Most standard car loans use simple interest, not compound interest. Interest accrues on the outstanding balance, and your fixed monthly payment covers that period's interest plus a portion of principal. There is no interest-on-interest mechanic the way compound interest works. However, if you miss a payment or your loan has a capitalization clause, unpaid interest may be added to your principal balance, which would then accrue more interest in future periods."),
        ("What happens if I make extra car loan payments?",
         "Extra payments applied to principal reduce your balance faster, which means less interest accrues each subsequent month. This shortens the total loan term and reduces total interest paid. On a $25,000 car loan at 7% over 60 months, adding $100 per month extra saves roughly $600 to $800 in interest and pays off the loan about 6 to 8 months early. Always confirm with your lender that extra payments are applied to principal and not held for future scheduled payments."),
        ("How much total interest will I pay on a $30,000 car loan?",
         "At a 7% rate over 60 months, a $30,000 car loan results in roughly $5,600 in total interest with a monthly payment of about $594. Stretched to 72 months the total interest rises to roughly $6,800 with a $512 monthly payment. At 84 months the total interest is about $8,100 with a $459 payment. A higher rate amplifies these numbers significantly. The same $30,000 loan at 12% over 60 months costs approximately $9,700 in total interest charges."),
        ("Does paying biweekly help with a car loan?",
         "Yes, though the benefit is smaller than with a 30-year mortgage because car loan terms are much shorter. Making a half-payment every two weeks instead of one full payment monthly results in 26 half-payments per year, which is equivalent to 13 full monthly payments. That one extra payment per year reduces principal faster and saves some interest. On a typical 5-year car loan the savings are a few hundred dollars and one to two months off the payoff date."),
    ],
    'new-vs-used-car-loan': [
        ("Do new or used cars have lower interest rates?",
         "New cars almost always have lower interest rates than used cars. Lenders view new cars as less risky collateral because the value is well established and they carry manufacturer warranties. Interest rate differences of 1 to 3 percentage points between new and used financing are common. However, new cars also cost more upfront, so the total interest paid over the life of the loan may still be higher on a new car even with a lower rate, because the lower rate does not fully offset the larger loan amount."),
        ("How much more does it cost to finance a used car compared to a new one?",
         "The higher interest rate on used cars adds meaningful cost over the loan term. A $25,000 used car loan at 8% over 60 months costs about $5,450 in total interest. The same amount at 6%, which is more typical for new car financing with good credit, costs about $4,000, a difference of $1,450 over 5 years. On older used cars with higher rates of 10 to 15%, the interest cost on a $20,000 loan can easily exceed $7,000 to $8,000 over the loan term."),
        ("What credit score do I need to get a good new car loan rate?",
         "For the best new car loan rates you generally need a credit score of 720 or above. Borrowers with scores of 750 or higher typically qualify for manufacturer promotional rates, sometimes as low as 0 to 2% APR. Scores between 660 and 720 usually result in rates of 4 to 7%. Below 660 is considered subprime territory and typically means rates of 10 to 20% or more from some lenders. Improving your score before applying is one of the most cost-effective ways to reduce your car's true total cost."),
        ("Is it better to finance a new or used car?",
         "It depends on your priorities and financial situation. New cars offer lower interest rates, full warranties, and predictable reliability, but depreciate quickly and lose 15 to 25% of value in the first year. Used cars cost less upfront and depreciate more slowly, but carry higher rates and more uncertainty around condition and history. Many financial advisors suggest a lightly used certified pre-owned vehicle that is 2 to 4 years old as the sweet spot, where most depreciation has already occurred and the rate premium over new is usually small."),
        ("How long can you finance a used car?",
         "Most lenders will finance used cars up to 72 or 84 months for newer used vehicles under 5 years old. Older vehicles often have term restrictions, and many lenders cap financing at 60 months for cars over 5 years old. Some lenders decline financing entirely for very old or high-mileage vehicles. Longer terms on older used cars are particularly risky because the vehicle may need significant repairs or depreciate below the loan balance before you finish paying it off."),
    ],
    'how-to-get-best-car-loan-rate': [
        ("What is a good interest rate for a car loan?",
         "A good car loan rate depends on your credit score and the current rate environment. For borrowers with excellent credit above 750, a competitive rate is below 5 to 6% for a new car. For used cars, below 7 to 8% is strong with good credit. Average rates across all credit tiers run higher, often 8 to 12%, because they include subprime borrowers. The best rates typically come from credit unions, followed by banks, and then dealership-arranged financing through captive lenders."),
        ("How do I qualify for a lower car loan interest rate?",
         "The most powerful factors are your credit score, income stability, down payment size, and chosen loan term length. Improve your credit score before applying by paying down revolving balances and correcting any errors on your credit report. A down payment of 20% or more reduces lender risk and often results in a better rate. Choosing a shorter term of 48 or 60 months rather than 72 to 84 typically lowers your rate because the lender faces less risk over a shorter repayment period."),
        ("Does getting pre-approved for a car loan hurt my credit score?",
         "Getting pre-approved triggers a hard inquiry, which may temporarily lower your score by 2 to 5 points. However, if you receive multiple pre-approvals within a 14 to 45 day window, depending on the scoring model, they are typically counted as a single inquiry for scoring purposes. The temporary impact is small and well worth it. Comparing rates from 3 to 5 lenders before committing can save you thousands of dollars over the life of the loan."),
        ("Should I get a car loan from a bank or a dealership?",
         "Get pre-approved from a bank or credit union before visiting the dealer. This gives you a benchmark rate and real negotiating leverage. Dealers often mark up rates from their lender partners, with the spread going to the dealership as profit, but they also have access to manufacturer incentive financing that can be very competitive. Walk in with your pre-approval in hand, and if the dealer can beat your rate, take the better offer. Never anchor the negotiation on your monthly payment target; focus on total cost and interest rate."),
        ("How much does credit score affect car loan interest rate?",
         "The impact is substantial. Borrowers with excellent credit above 750 average around 5 to 6% on new car loans nationally. With good credit between 700 and 749 it is typically 6 to 8%. Fair credit between 650 and 699 averages 8 to 12%. Poor credit below 600 can result in rates of 15 to 25% or even loan denial. The difference between excellent and poor credit on a $25,000 loan can exceed $8,000 to $10,000 in total interest cost over a 5-year loan term."),
    ],
    'car-loan-term-length-guide': [
        ("What is the best loan term length for a car?",
         "48 or 60 months is generally considered the sweet spot for car loans. These terms offer manageable monthly payments while limiting total interest paid and reducing the risk of being upside-down on the loan. Terms beyond 60 months increase the likelihood of owing more than the car is worth for extended periods, and total interest costs rise significantly with each additional year. Choosing a term where the payment fits your budget at 48 to 60 months is usually the financially optimal choice."),
        ("How much extra do you pay in interest on a 72-month versus a 60-month car loan?",
         "On a $30,000 car loan at 7%, a 60-month loan costs roughly $5,600 in total interest. A 72-month loan at the same rate costs roughly $6,800, about $1,200 more. However, the monthly payment drops from about $594 to $512, saving $82 per month. The cost of that monthly savings is $1,200 in extra interest and 12 additional payments. At higher loan amounts or interest rates the gap between the two terms widens further."),
        ("Is an 84-month car loan a bad idea?",
         "For most borrowers, yes. An 84-month car loan typically means paying significantly more in total interest, being upside-down on the loan for 3 to 5 years, making payments on an aging vehicle that may need costly repairs, and often paying a higher interest rate because lenders charge more for longer terms. The lower monthly payment can feel attractive, but the financial cost is substantial. If you need an 84-month term to make the payments fit your budget, the vehicle may be more than you can comfortably afford."),
        ("Does a longer car loan term affect your credit score?",
         "A longer term itself does not directly hurt your credit score. On-time payment history matters far more than the term length. However, being upside-down on the loan for years creates financial risk. If you need to sell, trade in, or the car is totaled while you owe more than the vehicle is worth, you may face negative equity you would need to pay out of pocket or roll into a new loan. Longer terms also mean the debt stays on your credit report longer, but consistent payment history during that period is a positive factor."),
        ("What is the maximum car loan term most lenders offer?",
         "Most lenders offer up to 84 months for new cars and 72 months for used cars. Some specialty lenders go up to 96 months, but these are unusual and come with very high total interest costs along with significant risk of being upside-down for nearly the entire loan period. Credit unions often offer more flexible terms than banks or dealer financing arms. As vehicles age, lenders impose tighter term restrictions to reduce their collateral risk."),
    ],
    'how-to-pay-off-car-loan-early': [
        ("Can I pay off my car loan early?",
         "Yes, in most cases. Standard car loans allow early payoff without penalty. You can pay extra toward principal at any time, make one large lump-sum payoff, or refinance to a shorter term. Before making a large extra payment, confirm with your lender that there is no prepayment penalty, which is rare on modern car loans but worth verifying. Also make sure your extra payments are applied to principal and not held as credit toward future scheduled payments."),
        ("How much do I save by paying off my car loan early?",
         "The savings depend on your rate, remaining balance, and how many months early you pay it off. On a $25,000 car loan at 7% over 60 months, paying off 12 months early saves roughly $900 to $1,000 in interest. Paying off 24 months early saves around $2,000. On higher-rate loans the savings are more substantial because each month of reduced balance eliminates more interest. Use an amortization calculator to see the exact savings on your specific loan."),
        ("Is there a prepayment penalty for paying off a car loan early?",
         "Most modern car loans from banks and credit unions do not have prepayment penalties. However, some dealer-arranged financing or subprime loans may include them. Check the prepayment section of your loan contract before making large extra payments. Prepayment penalties are typically stated as a percentage of the remaining balance or a set number of months of interest. If your contract includes one, calculate whether the penalty cost still makes early payoff financially worthwhile."),
        ("What is the best way to pay off a car loan faster?",
         "The most effective strategies are making biweekly half-payments instead of monthly payments, which results in one extra payment per year; adding extra principal to each monthly payment; applying windfalls like tax refunds or bonuses as lump-sum payments; and refinancing to a lower rate if your credit has improved since origination. Always specify that extra payments go toward principal. Even $50 to $100 per month extra meaningfully reduces total interest on most car loans."),
        ("Does paying off a car loan early hurt your credit?",
         "Paying off a car loan early generally has a neutral to slightly negative short-term effect on credit scores. Closing an installment account can slightly reduce your average account age and credit mix. However, the effect is usually minor and temporary, typically 5 to 15 points, and most people's scores recover within a few months. The financial savings from paying less interest almost always outweigh any brief credit score dip, especially if you have other open accounts maintaining your credit history."),
    ],
    'car-loan-down-payment-guide': [
        ("How much should I put down on a car?",
         "20% is the commonly recommended down payment for a new car. At 20% down you are less likely to become immediately upside-down due to depreciation after driving off the lot. For used cars, 10% is a reasonable starting point since much of the depreciation has already occurred. That said, any down payment is better than none. Even 5 to 10% meaningfully reduces your loan amount, monthly payment, and total interest paid over the life of the loan."),
        ("What happens if I put no money down on a car?",
         "A zero-down purchase means you immediately owe the full purchase price plus taxes and fees on an asset that starts depreciating the moment you drive it off the lot. New cars lose 15 to 20% of value in the first year. With no down payment you could quickly be $3,000 to $5,000 upside-down, meaning if the car is totaled or you need to sell, you would still owe money after the proceeds. Most financial advisors recommend against zero-down financing unless you are getting 0% APR or have exceptional financial stability."),
        ("How does a car down payment affect my monthly payment?",
         "A larger down payment directly reduces your loan amount, which lowers both the monthly payment and total interest. On a $30,000 car at 7% over 60 months with 10% down ($3,000), your payment is about $534 per month. With 20% down ($6,000), it drops to about $475 per month, roughly $59 less each month. Over 60 months that is $3,540 saved in total payments, plus you also pay interest on a smaller principal throughout the entire loan term."),
        ("Does the size of a car down payment affect the interest rate?",
         "Sometimes. A larger down payment reduces the loan-to-value ratio, which lowers lender risk, and some lenders offer slightly better rates for lower-LTV loans, particularly on used cars. The rate improvement is usually modest, around 0.25 to 0.5 percentage points, compared to the larger impact of credit score on rate. However, even a small rate improvement combined with a smaller loan balance produces meaningful total savings over the loan term."),
        ("Can I use a trade-in as a down payment on a car?",
         "Yes. Your trade-in's value is applied directly against the purchase price, reducing the amount you need to finance. This works the same as a cash down payment from a loan calculation perspective. Get your trade-in appraised independently at a third-party buyer or dealer before negotiating to ensure you receive fair market value. Dealers sometimes undervalue a trade-in on paper while adjusting the purchase price to compensate, so negotiate the sale price and trade-in value as separate transactions when possible."),
    ],
}

def make_faq_ts(items):
    lines = ['const faq = [']
    for i, (q, a) in enumerate(items):
        comma = ',' if i < len(items) - 1 else ''
        q_escaped = q.replace('\\', '\\\\').replace('"', '\\"')
        a_escaped = a.replace('\\', '\\\\').replace('"', '\\"')
        lines.append(f'  {{ q: "{q_escaped}", a: "{a_escaped}" }}{comma}')
    lines.append(']')
    return '\n'.join(lines) + '\n\n'

for slug, items in FAQS.items():
    path = os.path.join(BASE, slug, 'page.tsx')
    with open(path) as f:
        content = f.read()

    if 'const faq = [' in content:
        print(f'SKIP (already has faq): {slug}')
        continue

    faq_ts = make_faq_ts(items)
    content = content.replace('export default function Page()', faq_ts + 'export default function Page()')

    # Handle both with and without related prop
    import re
    content = re.sub(r'<ArticleLayout([^>]*?)>', lambda m: f'<ArticleLayout{m.group(1)} faq={{faq}}>', content)

    with open(path, 'w') as f:
        f.write(content)

    print(f'Updated: {slug}')

print('Done.')
