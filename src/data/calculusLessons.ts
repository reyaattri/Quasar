export const calculusLessons = [
  {
    title: "The slope detective",
    subtitle: "Derivatives · from change to the chain rule",
    steps: [
      [
        "What are we measuring?",
        "A function turns an input into an output. For f(x) = x², input 2 gives output 4. A derivative asks: how quickly is the output changing right here? Imagine a detective checking the steepness of a hill, not its height.",
        "Height is f(x). Local steepness is f′(x). They are different measurements.",
      ],
      [
        "Bring the two footprints together",
        "Between x and x+h, the average slope is [f(x+h) − f(x)] / h. For x² this becomes [(x+h)² − x²] / h = 2x+h, as long as h is not zero. Let h approach zero: the slope approaches 2x. We take a limit; we do not divide by zero.",
        "The detective cat says “enhance!” and squints at two pawprints. Squeeze the gap smaller: the average slope gets closer to the slope right here. The cat’s magnifying glass changes the gap, not the height of the hill.",
      ],
      [
        "A rule you can use",
        "For xⁿ, the power rule gives n·xⁿ⁻¹ wherever the expression and derivative are defined. The exponent comes down, then loses one. So d(x³)/dx = 3x². Constants disappear because their rate of change is zero. Differentiate sums term by term.",
        "The exponent cat declares itself king, slides downstairs, and loses one crown. Bring the old power down in front; lower the power by one. Big royal drama, tiny rule.",
      ],
      [
        "Work through a whole function",
        "For f(x) = 3x⁴ − 2x + 7: keep the coefficient 3 and differentiate x⁴ to get 12x³. The derivative of −2x is −2. The constant 7 gives zero. Together: f′(x) = 12x³ − 2. At x = 1 the slope is 10.",
        "Coefficient stays. Power changes. Constant rests.",
      ],
      [
        "A function inside a function",
        "For (3x+1)², the outside is “square it” and the inside is 3x+1. The chain rule multiplies the outside derivative, evaluated at the inside, by the inside derivative: 2(3x+1) × 3. The result is 6(3x+1). Forgetting ×3 loses the speed of the inner change.",
        "Two linked gears: the outside turns, but the inside gear changes its speed too.",
      ],
    ],
    question: "What is the derivative of (2x+1)³?",
    choices: ["3(2x+1)²", "6(2x+1)²", "6(2x+1)³"],
    answer: 1,
    explanation:
      "Differentiate the outer cube: 3(2x+1)². Multiply by the derivative of 2x+1, which is 2. This gives 6(2x+1)².",
  },
  {
    title: "The antiderivative bakery",
    subtitle: "Indefinite integration · rebuild the original",
    steps: [
      [
        "Reverse the question",
        "A derivative takes a function and gives its rate of change. An antiderivative asks for a function that would give this rate when differentiated. Since the derivative of x³ is 3x², an antiderivative of 3x² is x³.",
        "The bakery cat has smashed the cake and now claims it was “quality control.” Integration rebuilds a cake from the crumbs. Rebuild x³ from 3x², then differentiate to check the cat’s work.",
      ],
      [
        "The missing constant",
        "The derivatives of x³, x³+4 and x³−100 are all 3x². Differentiation loses a constant, so an indefinite integral gives a family: ∫3x² dx = x³+C. C is one arbitrary constant; it is not always zero.",
        "The smug cat hides cake stands everywhere. Same cake, different stand height: +C. Crumbs cannot tell you the stand height, so never let the cat steal your C.",
      ],
      [
        "Raise, then divide",
        "For a power xⁿ with n ≠ −1, ∫xⁿ dx = xⁿ⁺¹/(n+1)+C on a suitable interval. Raise the power by one, then divide by the new power. For 6x², this gives 6x³/3 = 2x³, plus C. Check by differentiating.",
        "The baker raises the cake one floor, then divides it among the new number of floors.",
      ],
      [
        "The exception matters",
        "For x⁻¹ = 1/x, the usual formula would divide by zero. Instead ∫1/x dx = ln|x|+C on an interval that does not cross zero. Integration rules have conditions; the power trick cannot ignore this one.",
        "A cake with zero guests cannot be divided. The baker opens the logarithm recipe instead.",
      ],
      [
        "Undo a chain rule with substitution",
        "For ∫2x(x²+1)³ dx, set u = x²+1. Then du = 2x dx, exactly the extra factor already present. The integral becomes ∫u³ du = u⁴/4+C. Put x back: (x²+1)⁴/4+C. Differentiating this result reproduces the original integrand.",
        "Bundle the inner recipe into a box labelled u. Its matching ingredient, du, must come along too.",
      ],
    ],
    question: "Find ∫(4x³ + 2) dx.",
    choices: ["12x²+C", "x⁴+2x+C", "x⁴+2+C"],
    answer: 1,
    explanation:
      "4x³ integrates to x⁴; the constant 2 integrates to 2x. Add C. Differentiating x⁴+2x+C gives 4x³+2.",
  },
  {
    title: "The accumulation station",
    subtitle: "Definite integrals · limits, area and the fundamental theorem",
    steps: [
      [
        "A rate is not a total",
        "Suppose water flows into a tank at r(t) = 2t litres per minute. The rate at minute 3 is 6 litres per minute. That is not the total water added. To get a total, add rate × time over many small intervals.",
        "The station cat says “this is fine” while a thousand buckets arrive. The tap’s speed is the rate. All the collected water is the total. Count the buckets, not just the latest splash.",
      ],
      [
        "Thin slices become an integral",
        "A rectangle with width Δt and height r(t) estimates the water added during one short interval. Add many rectangles. As their maximum width approaches zero, their sum approaches the definite integral. The units are litres/minute × minutes = litres.",
        "Make the bucket-counting intervals smaller until the estimate settles.",
      ],
      [
        "The fundamental theorem does the adding",
        "If r is continuous and F′ = r, then ∫ from a to b of r(t) dt = F(b) − F(a). For r(t)=2t, use F(t)=t². From 1 to 3 minutes, the added water is 3²−1² = 8 litres. The arbitrary constant cancels.",
        "Top ticket minus bottom ticket: evaluate the antiderivative at the upper bound, then subtract the lower.",
      ],
      [
        "Signed area can cancel",
        "An integral records signed accumulation. Above the horizontal axis contributes positively; below contributes negatively. For f(x)=x from −1 to 1, the integral is zero. The total geometric area is 1, because each triangle has area 1/2. For total area, split at sign changes and add absolute areas.",
        "One cat brings a bucket in; another sneaks the same amount out. The inspector celebrates ZERO extra water. Lots happened, but the net change is zero. Signed area subtracts the below-axis part.",
      ],
      [
        "Change the bounds when you substitute",
        "For ∫ from 0 to 1 of 2x(x²+1) dx, set u=x²+1. At x=0, u=1; at x=1, u=2. Integrate u from 1 to 2: [u²/2] = 2−1/2 = 3/2. Use u bounds with u, or change back to x before using x bounds.",
        "A new train line needs new station names. Never put x tickets on the u train.",
      ],
    ],
    question: "A rate is r(t)=3t². What is ∫ from 0 to 2 of r(t) dt?",
    choices: ["12", "8", "6"],
    answer: 1,
    explanation:
      "An antiderivative of 3t² is t³. Evaluate 2³−0³ = 8. The endpoint rate 12 is not the accumulated total.",
  },
];
