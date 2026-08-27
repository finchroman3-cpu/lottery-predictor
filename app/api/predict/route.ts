import { NextResponse } from "next/server";
import { fetchLotteryResults, generatePredictions } from "@/lib/predictor";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Re-fetch at most once per hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const game = (searchParams.get("game") || "pick6") as "pick3" | "pick4" | "pick6";

  const validGames = ["pick3", "pick4", "pick6"];
  if (!validGames.includes(game)) {
    return NextResponse.json({ error: "Invalid game. Use: pick3, pick4, or pick6" }, { status: 400 });
  }

  const gameConfig = {
    pick3: { maxNumber: 9, pickCount: 3 },
    pick4: { maxNumber: 9, pickCount: 4 },
    pick6: { maxNumber: 49, pickCount: 6 },
  };

  try {
    const draws = await fetchLotteryResults(game);
    
    if (draws.length === 0) {
      return NextResponse.json({ 
        error: "Could not fetch lottery data. Try again later.",
        predictions: [],
        hotNumbers: [],
        coldNumbers: [],
        topPairs: [],
        oddEvenPattern: "",
        totalDraws: 0,
      }, { status: 200 });
    }

    const config = gameConfig[game];
    const result = generatePredictions(draws, config.maxNumber, config.pickCount, 10);

    return NextResponse.json({
      game,
      ...result,
      recentDraws: draws.slice(0, 10),
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
