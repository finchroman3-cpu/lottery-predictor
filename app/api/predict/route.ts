import { NextResponse } from "next/server";
import {
  fetchLotteryResults,
  generatePredictions,
  STATE_GAMES,
  type StateCode,
  type GameType,
} from "@/lib/predictor";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Re-fetch at most once per hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = (searchParams.get("state") || "nj") as StateCode;
  const game = (searchParams.get("game") || "pick6") as GameType;

  if (!(state in STATE_GAMES)) {
    return NextResponse.json({ error: "Invalid state. Use: nj or ny" }, { status: 400 });
  }
  if (!(game in STATE_GAMES[state])) {
    return NextResponse.json({ error: "Invalid game. Use: pick3, pick4, or pick6" }, { status: 400 });
  }

  const source = STATE_GAMES[state][game];

  try {
    const draws = await fetchLotteryResults(state, game);

    if (draws.length === 0) {
      return NextResponse.json({
        error: "Could not fetch lottery data. Try again later.",
        predictions: [],
        hotNumbers: [],
        coldNumbers: [],
        topPairs: [],
        oddEvenPattern: "",
        totalDraws: 0,
        live: source.slug !== null,
      }, { status: 200 });
    }

    const result = generatePredictions(draws, source.maxNumber, source.pickCount, 10);

    return NextResponse.json({
      state,
      game,
      ...result,
      recentDraws: draws.slice(0, 10),
      live: source.slug !== null,
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    return NextResponse.json({
      error: "Internal error",
      message: String(error),
    }, { status: 500 });
  }
}
