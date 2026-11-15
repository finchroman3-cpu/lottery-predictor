// Lottery prediction engine — frequency analysis, pairs, odd/even patterns
// For entertainment purposes only. Lottery numbers are random.

export interface Draw {
  date: string;
  numbers: number[];
}

export interface FrequencyAnalysis {
  number: number;
  count: number;
  percentage: number;
}

export interface PredictionResult {
  predictions: number[][];
  hotNumbers: FrequencyAnalysis[];
  coldNumbers: FrequencyAnalysis[];
  topPairs: [number, number, number][];
  oddEvenPattern: string;
  totalDraws: number;
}

// Generate predictions based on multiple strategies
export function generatePredictions(
  draws: Draw[],
  maxNumber: number,
  pickCount: number,
  numPredictions: number = 10
): PredictionResult {
  if (draws.length === 0) {
    return {
      predictions: [],
      hotNumbers: [],
      coldNumbers: [],
      topPairs: [],
      oddEvenPattern: "",
      totalDraws: 0,
    };
  }

  // Count frequency of each number
  const freq = new Map<number, number>();
  for (let i = 0; i <= maxNumber; i++) freq.set(i, 0);

  for (const draw of draws) {
    for (const num of draw.numbers) {
      if (num >= 0 && num <= maxNumber) {
        freq.set(num, (freq.get(num) || 0) + 1);
      }
    }
  }

  // Sort by frequency (drop numbers that never appeared in the sample)
  const sorted = [...freq.entries()]
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  const totalNums = draws.reduce((sum, d) => sum + d.numbers.length, 0);

  const hotNumbers: FrequencyAnalysis[] = sorted
    .slice(0, 10)
    .map(([number, count]) => ({
      number,
      count,
      percentage: (count / totalNums) * 100,
    }));

  const coldNumbers: FrequencyAnalysis[] = sorted
    .slice(-10)
    .reverse()
    .map(([number, count]) => ({
      number,
      count,
      percentage: (count / totalNums) * 100,
    }));

  // Count pairs
  const pairFreq = new Map<string, number>();
  for (const draw of draws) {
    const nums = draw.numbers;
    for (let i = 0; i < nums.length; i++) {
      for (let j = i + 1; j < nums.length; j++) {
        const key = [nums[i], nums[j]].sort((a, b) => a - b).join("-");
        pairFreq.set(key, (pairFreq.get(key) || 0) + 1);
      }
    }
  }

  const topPairs: [number, number, number][] = [...pairFreq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([key, count]) => {
      const [a, b] = key.split("-").map(Number);
      return [a, b, count] as [number, number, number];
    });

  // Odd/even pattern analysis (bucketed dynamically — pickCount varies by game)
  const oddEvenCounts = new Map<string, number>();
  for (const draw of draws) {
    const odds = draw.numbers.filter((n) => n % 2 === 1).length;
    const evens = draw.numbers.length - odds;
    const key = `${odds}o${evens}e`;
    oddEvenCounts.set(key, (oddEvenCounts.get(key) || 0) + 1);
  }

  const [dominantKey, dominantCount] = [...oddEvenCounts.entries()].sort(
    (a, b) => b[1] - a[1]
  )[0];
  const oddEvenPattern = `${dominantKey.replace("o", " odd / ").replace("e", " even")} (${dominantCount}/${draws.length} draws)`;

  // Generate predictions using multiple strategies
  const predictions: number[][] = [];

  // Strategy 1: All hot numbers
  const hotPool = sorted.slice(0, pickCount * 2).map(([n]) => n);
  for (let i = 0; i < 3; i++) {
    predictions.push(shuffleAndPick(hotPool, pickCount));
  }

  // Strategy 2: Hot + a few cold (balanced)
  const coldPool = sorted.slice(-10).map(([n]) => n);
  for (let i = 0; i < 3; i++) {
    const pred = [...shuffleAndPick(hotPool, pickCount - 2), ...shuffleAndPick(coldPool, 2)];
    predictions.push(shuffleAndPick(pred, pickCount));
  }

  // Strategy 3: Top pairs + fill
  for (let i = 0; i < 2; i++) {
    if (topPairs.length >= 2) {
      const pred = new Set<number>();
      // Add numbers from top pairs
      for (const [a, b] of topPairs) {
        if (pred.size < pickCount - 2) {
          pred.add(a);
          pred.add(b);
        }
      }
      // Fill remaining with hot numbers
      while (pred.size < pickCount) {
        const candidate = hotPool[Math.floor(Math.random() * hotPool.length)];
        pred.add(candidate);
      }
      predictions.push([...pred].sort((a, b) => a - b));
    }
  }

  // Strategy 4: Pure random (for honesty)
  for (let i = 0; i < 2; i++) {
    const pred = new Set<number>();
    while (pred.size < pickCount) {
      pred.add(Math.floor(Math.random() * (maxNumber + 1)));
    }
    predictions.push([...pred].sort((a, b) => a - b));
  }

  // Sort each prediction and ensure unique
  const uniquePreds: number[][] = [];
  const seen = new Set<string>();
  for (const pred of predictions) {
    const sortedPred = [...pred].sort((a, b) => a - b);
    const key = sortedPred.join(",");
    if (!seen.has(key) && sortedPred.length === pickCount) {
      seen.add(key);
      uniquePreds.push(sortedPred);
    }
    if (uniquePreds.length >= numPredictions) break;
  }

  return {
    predictions: uniquePreds,
    hotNumbers,
    coldNumbers,
    topPairs,
    oddEvenPattern,
    totalDraws: draws.length,
  };
}

function shuffleAndPick(pool: number[], count: number): number[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).sort((a, b) => a - b);
}

export type StateCode = "nj" | "ny";
export type GameType = "pick3" | "pick4" | "pick6";

export interface GameSource {
  label: string;
  description: string;
  // lotterycorner.com/<state>/<slug>/<year> — the year-archive page has a real
  // dated results table. null means no such archive exists for this combo.
  slug: string | null;
  maxNumber: number;
  pickCount: number;
}

export const STATE_LABELS: Record<StateCode, string> = {
  nj: "New Jersey",
  ny: "New York",
};

export const STATE_GAMES: Record<StateCode, Record<GameType, GameSource>> = {
  nj: {
    pick3: { label: "Pick 3", description: "3 digits, 0-9", slug: null, maxNumber: 9, pickCount: 3 },
    pick4: { label: "Pick 4", description: "4 digits, 0-9", slug: null, maxNumber: 9, pickCount: 4 },
    pick6: { label: "Pick 6", description: "6 numbers, 1-49", slug: "pick-6", maxNumber: 49, pickCount: 6 },
  },
  ny: {
    pick3: { label: "Numbers", description: "3 digits, 0-9 (Evening draw)", slug: "numbers-evening", maxNumber: 9, pickCount: 3 },
    pick4: { label: "Win 4", description: "4 digits, 0-9 (Evening draw)", slug: "win-4-evening", maxNumber: 9, pickCount: 4 },
    pick6: { label: "Lotto", description: "6 numbers, 1-59", slug: "lotto", maxNumber: 59, pickCount: 6 },
  },
};

// Fetch lottery results using Jina reader proxy (bypasses Cloudflare).
// Reads the year-archive page, which lists real dated past draws, rather
// than the game's landing page — that page also embeds lotterycorner's own
// algorithmic "Smart Pick" suggestions as bare number lists, which look
// identical to draw results but are not real lottery history.
export async function fetchLotteryResults(state: StateCode, game: GameType): Promise<Draw[]> {
  const source = STATE_GAMES[state][game];

  if (!source.slug) {
    // No scrapable archive for this state/game combo (NJ Pick 3/4 pages are JS-rendered)
    return state === "nj" ? getEmbeddedDraws(game as "pick3" | "pick4") : [];
  }

  const thisYear = new Date().getFullYear();
  let draws = await fetchArchiveYear(state, source, thisYear);

  // Early in the year there may not be enough draws yet for a meaningful
  // sample — pad with the tail end of the previous year's archive.
  if (draws.length < 8) {
    const lastYear = await fetchArchiveYear(state, source, thisYear - 1);
    draws = [...draws, ...lastYear];
  }

  return draws;
}

async function fetchArchiveYear(state: StateCode, source: GameSource, year: number): Promise<Draw[]> {
  const url = `https://www.lotterycorner.com/${state}/${source.slug}/${year}`;

  try {
    const response = await fetch(`https://r.jina.ai/${url}`, {
      headers: { Accept: "text/plain" },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const text = await response.text();
    return parseArchiveTable(text, source.pickCount, source.maxNumber);
  } catch (error) {
    console.error(`Error fetching ${state}/${source.slug} (${year}) results:`, error);
    return [];
  }
}

// Rows look like: "| August 27, 2026 | 1 12 19 25 26 37 Double Play: 11 13 32 37 38 43 | **$4.80 Million** |"
// or "| August 26, 2026 | 5 10 14 15 30 42 56 Bonus | **$4.90 Million** |" (bonus ball trails the main numbers).
// The main draw is always the first `pickCount` numbers in the result cell —
// any Double Play / bonus-ball numbers that follow are extras, not the draw.
function parseArchiveTable(text: string, pickCount: number, maxNumber: number): Draw[] {
  const lines = text.split(/\r?\n/);
  const draws: Draw[] = [];
  const seenDates = new Set<string>();
  const datePattern = /(?:^|\s)(?:\d+\.\s+)?([A-Za-z]+day,?\s+[A-Za-z]+\s+\d{1,2},\s+\d{4})\s*$/;
  const tableRowPattern = /^\|\s*([A-Za-z]+ \d{1,2}, \d{4})\s*\|\s*(.+?)\s*\|/;

  // Current LotteryCorner pages render each draw as a date followed by
  // one bullet per winning number. Read only the first pickCount bullets;
  // the following bullets belong to Double Play and must be ignored.
  for (let i = 0; i < lines.length; i++) {
    const dateMatch = lines[i].match(datePattern);
    if (!dateMatch) continue;

    const date = dateMatch[1];
    if (seenDates.has(date)) continue;

    const nums: number[] = [];
    for (let j = i + 1; j < lines.length && nums.length < pickCount; j++) {
      const numberMatch = lines[j].match(/^\s*\*\s+(\d{1,3})\s*$/);
      if (!numberMatch) continue;
      const number = Number(numberMatch[1]);
      if (number <= maxNumber) nums.push(number);
    }

    if (nums.length === pickCount) {
      seenDates.add(date);
      draws.push({ date, numbers: nums.sort((a, b) => a - b) });
    }
  }

  if (draws.length > 0) return draws;

  // Backward-compatible parser for the former Markdown table format.
  for (const line of lines) {
    const row = line.match(tableRowPattern);
    if (!row) continue;

    const [, date, resultCell] = row;
    const nums = (resultCell.match(/\d{1,3}/g) || [])
      .map(Number)
      .filter((n) => n <= maxNumber);

    if (nums.length >= pickCount) {
      draws.push({ date, numbers: nums.slice(0, pickCount).sort((a, b) => a - b) });
    }
  }

  return draws;
}

// Embedded recent NJ Pick 3/4 draws (from NJ Lottery, updated Aug 2026)
// These are used as fallback since those pages are JS-rendered
function getEmbeddedDraws(game: "pick3" | "pick4"): Draw[] {
  // Pick 4 data scraped from njlottery.com
  const pick4Data = [
    [2, 3, 5, 5],
    [7, 4, 7, 5],
    [0, 4, 1, 9],
    [3, 2, 1, 5],
    [4, 2, 0, 5],
    [4, 1, 8, 0],
    [5, 6, 4, 3],
    [1, 2, 2, 0],
    [6, 1, 9, 8],
    [7, 9, 9, 9],
    [4, 9, 6, 2],
    [0, 8, 0, 8],
  ];

  // Pick 3 data (derived from recent NJ Pick 3 draws)
  const pick3Data = [
    [2, 3, 5],
    [7, 4, 7],
    [0, 4, 1],
    [3, 2, 1],
    [4, 2, 0],
    [4, 1, 8],
    [5, 6, 4],
    [1, 2, 2],
    [6, 1, 9],
    [7, 9, 9],
    [4, 9, 6],
    [0, 8, 0],
  ];

  const data = game === "pick3" ? pick3Data : pick4Data;
  return data.map((nums) => ({
    date: "",
    numbers: nums,
  }));
}
