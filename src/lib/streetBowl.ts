// Same greedy pick as candyops' street_bowl.py, so the in-browser simulator matches the pipeline's result.

export interface Candy {
  candy: string;
  win: number;
  safe: string[];
}

export type Rates = Record<string, number>;

const expectedWin = (bowl: Candy[], rates: Rates) => {
  const none = 1 - Object.values(rates).reduce((s, r) => s + r, 0);
  let total = none * Math.max(0, ...bowl.map((c) => c.win));
  for (const [allergy, share] of Object.entries(rates)) {
    total += share * Math.max(0, ...bowl.filter((c) => c.safe.includes(allergy)).map((c) => c.win));
  }
  return total;
};

export function streetBowl(candies: Candy[], rates: Rates, size = 10): Candy[] {
  const bowl: Candy[] = [];
  for (let i = 0; i < size; i++) {
    let best: Candy | undefined;
    let bestScore = -1;
    for (const c of candies) {
      if (bowl.includes(c)) continue;
      const score = expectedWin([...bowl, c], rates);
      if (score > bestScore + 1e-9 || (Math.abs(score - bestScore) <= 1e-9 && best && c.win > best.win)) {
        best = c;
        bestScore = score;
      }
    }
    if (best) bowl.push(best);
  }
  return bowl;
}
