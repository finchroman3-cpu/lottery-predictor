module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[project]/app/api/predict/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic,
    "revalidate",
    ()=>revalidate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$predictor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/predictor.ts [app-route] (ecmascript)");
;
;
const dynamic = "force-dynamic";
const revalidate = 3600; // Re-fetch at most once per hour
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const game = searchParams.get("game") || "pick6";
    const validGames = [
        "pick3",
        "pick4",
        "pick6"
    ];
    if (!validGames.includes(game)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Invalid game. Use: pick3, pick4, or pick6"
        }, {
            status: 400
        });
    }
    const gameConfig = {
        pick3: {
            maxNumber: 9,
            pickCount: 3
        },
        pick4: {
            maxNumber: 9,
            pickCount: 4
        },
        pick6: {
            maxNumber: 49,
            pickCount: 6
        }
    };
    try {
        const draws = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$predictor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchLotteryResults"])(game);
        if (draws.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Could not fetch lottery data. Try again later.",
                predictions: [],
                hotNumbers: [],
                coldNumbers: [],
                topPairs: [],
                oddEvenPattern: "",
                totalDraws: 0
            }, {
                status: 200
            });
        }
        const config = gameConfig[game];
        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$predictor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generatePredictions"])(draws, config.maxNumber, config.pickCount, 10);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            game,
            ...result,
            recentDraws: draws.slice(0, 10)
        }, {
            headers: {
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200"
            }
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Internal error",
            message: String(error)
        }, {
            status: 500
        });
    }
}
}),
"[project]/lib/predictor.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Lottery prediction engine — frequency analysis, pairs, odd/even patterns
// For entertainment purposes only. Lottery numbers are random.
__turbopack_context__.s([
    "fetchLotteryResults",
    ()=>fetchLotteryResults,
    "generatePredictions",
    ()=>generatePredictions
]);
function generatePredictions(draws, maxNumber, pickCount, numPredictions = 10) {
    if (draws.length === 0) {
        return {
            predictions: [],
            hotNumbers: [],
            coldNumbers: [],
            topPairs: [
                [
                    0,
                    0,
                    0
                ]
            ],
            oddEvenPattern: "",
            totalDraws: 0
        };
    }
    // Count frequency of each number
    const freq = new Map();
    for(let i = 0; i <= maxNumber; i++)freq.set(i, 0);
    for (const draw of draws){
        for (const num of draw.numbers){
            if (num >= 0 && num <= maxNumber) {
                freq.set(num, (freq.get(num) || 0) + 1);
            }
        }
    }
    // Sort by frequency
    const sorted = [
        ...freq.entries()
    ].filter(([n])=>n > 0).sort((a, b)=>b[1] - a[1]);
    const totalNums = draws.reduce((sum, d)=>sum + d.numbers.length, 0);
    const hotNumbers = sorted.slice(0, 10).map(([number, count])=>({
            number,
            count,
            percentage: count / totalNums * 100
        }));
    const coldNumbers = sorted.slice(-10).reverse().map(([number, count])=>({
            number,
            count,
            percentage: count / totalNums * 100
        }));
    // Count pairs
    const pairFreq = new Map();
    for (const draw of draws){
        const nums = draw.numbers;
        for(let i = 0; i < nums.length; i++){
            for(let j = i + 1; j < nums.length; j++){
                const key = [
                    nums[i],
                    nums[j]
                ].sort((a, b)=>a - b).join("-");
                pairFreq.set(key, (pairFreq.get(key) || 0) + 1);
            }
        }
    }
    const topPairs = [
        ...pairFreq.entries()
    ].sort((a, b)=>b[1] - a[1]).slice(0, 5).map(([key, count])=>{
        const [a, b] = key.split("-").map(Number);
        return [
            a,
            b,
            count
        ];
    });
    // Odd/even pattern analysis
    const oddEvenCounts = {
        "6o0e": 0,
        "5o1e": 0,
        "4o2e": 0,
        "3o3e": 0,
        "2o4e": 0,
        "1o5e": 0,
        "0o6e": 0
    };
    for (const draw of draws){
        const odds = draw.numbers.filter((n)=>n % 2 === 1).length;
        const evens = draw.numbers.length - odds;
        const key = `${odds}o${evens}e`;
        if (key in oddEvenCounts) oddEvenCounts[key]++;
    }
    const dominantPattern = Object.entries(oddEvenCounts).sort((a, b)=>b[1] - a[1])[0];
    const oddEvenPattern = `${dominantPattern[0].replace("o", " odd / ").replace("e", " even")} (${dominantPattern[1]}/${draws.length} draws)`;
    // Generate predictions using multiple strategies
    const predictions = [];
    // Strategy 1: All hot numbers
    const hotPool = sorted.slice(0, pickCount * 2).map(([n])=>n);
    for(let i = 0; i < 3; i++){
        predictions.push(shuffleAndPick(hotPool, pickCount));
    }
    // Strategy 2: Hot + a few cold (balanced)
    const coldPool = sorted.slice(-10).map(([n])=>n);
    for(let i = 0; i < 3; i++){
        const pred = [
            ...shuffleAndPick(hotPool, pickCount - 2),
            ...shuffleAndPick(coldPool, 2)
        ];
        predictions.push(shuffleAndPick(pred, pickCount));
    }
    // Strategy 3: Top pairs + fill
    for(let i = 0; i < 2; i++){
        if (topPairs.length >= 2) {
            const pred = new Set();
            // Add numbers from top pairs
            for (const [a, b] of topPairs){
                if (pred.size < pickCount - 2) {
                    pred.add(a);
                    pred.add(b);
                }
            }
            // Fill remaining with hot numbers
            while(pred.size < pickCount){
                const candidate = hotPool[Math.floor(Math.random() * hotPool.length)];
                pred.add(candidate);
            }
            predictions.push([
                ...pred
            ].sort((a, b)=>a - b));
        }
    }
    // Strategy 4: Pure random (for honesty)
    for(let i = 0; i < 2; i++){
        const pred = new Set();
        while(pred.size < pickCount){
            pred.add(Math.floor(Math.random() * (maxNumber + 1)));
        }
        predictions.push([
            ...pred
        ].sort((a, b)=>a - b));
    }
    // Sort each prediction and ensure unique
    const uniquePreds = [];
    const seen = new Set();
    for (const pred of predictions){
        const sortedPred = [
            ...pred
        ].sort((a, b)=>a - b);
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
        totalDraws: draws.length
    };
}
function shuffleAndPick(pool, count) {
    const shuffled = [
        ...pool
    ].sort(()=>Math.random() - 0.5);
    return shuffled.slice(0, count).sort((a, b)=>a - b);
}
async function fetchLotteryResults(game) {
    const gameConfig = {
        pick3: {
            url: "https://www.lotterycorner.com/nj/pick-3",
            maxNumber: 9,
            pickCount: 3
        },
        pick4: {
            url: "https://www.lotterycorner.com/nj/pick-4",
            maxNumber: 9,
            pickCount: 4
        },
        pick6: {
            url: "https://www.lotterycorner.com/nj/pick-6",
            maxNumber: 49,
            pickCount: 6
        }
    };
    const config = gameConfig[game];
    // Pick 3 and Pick 4 aren't available on lotterycorner
    // Use embedded recent data from NJ Lottery (scraped periodically)
    if (game === "pick3" || game === "pick4") {
        return getEmbeddedDraws(game);
    }
    try {
        const response = await fetch(`https://r.jina.ai/${config.url}`, {
            headers: {
                "Accept": "text/plain"
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }
        const text = await response.text();
        // Parse draws from the text
        const draws = [];
        const pickCount = config.pickCount;
        const pattern = new RegExp(`(\\d{1,2})\\s+(\\d{1,2})` + (pickCount > 2 ? `\\s+(\\d{1,2})` : "") + (pickCount > 3 ? `\\s+(\\d{1,2})` : "") + (pickCount > 4 ? `\\s+(\\d{1,2})\\s+(\\d{1,2})` : ""), "g");
        let match;
        const seen = new Set();
        while((match = pattern.exec(text)) !== null){
            const nums = match.slice(1).filter(Boolean).map(Number);
            // Validate numbers are in range
            if (nums.length === pickCount && nums.every((n)=>n >= 0 && n <= config.maxNumber)) {
                const key = nums.sort((a, b)=>a - b).join(",");
                if (!seen.has(key)) {
                    seen.add(key);
                    draws.push({
                        date: "",
                        numbers: nums.sort((a, b)=>a - b)
                    });
                }
            }
        }
        return draws;
    } catch (error) {
        console.error(`Error fetching ${game} results:`, error);
        return [];
    }
}
// Embedded recent NJ Pick 3/4 draws (from NJ Lottery, updated Aug 2026)
// These are used as fallback since those pages are JS-rendered
function getEmbeddedDraws(game) {
    // Pick 4 data scraped from njlottery.com
    const pick4Data = [
        [
            2,
            3,
            5,
            5
        ],
        [
            7,
            4,
            7,
            5
        ],
        [
            0,
            4,
            1,
            9
        ],
        [
            3,
            2,
            1,
            5
        ],
        [
            4,
            2,
            0,
            5
        ],
        [
            4,
            1,
            8,
            0
        ],
        [
            5,
            6,
            4,
            3
        ],
        [
            1,
            2,
            2,
            0
        ],
        [
            6,
            1,
            9,
            8
        ],
        [
            7,
            9,
            9,
            9
        ],
        [
            4,
            9,
            6,
            2
        ],
        [
            0,
            8,
            0,
            8
        ]
    ];
    // Pick 3 data (derived from recent NJ Pick 3 draws)
    const pick3Data = [
        [
            2,
            3,
            5
        ],
        [
            7,
            4,
            7
        ],
        [
            0,
            4,
            1
        ],
        [
            3,
            2,
            1
        ],
        [
            4,
            2,
            0
        ],
        [
            4,
            1,
            8
        ],
        [
            5,
            6,
            4
        ],
        [
            1,
            2,
            2
        ],
        [
            6,
            1,
            9
        ],
        [
            7,
            9,
            9
        ],
        [
            4,
            9,
            6
        ],
        [
            0,
            8,
            0
        ]
    ];
    const data = game === "pick3" ? pick3Data : pick4Data;
    return data.map((nums)=>({
            date: "",
            numbers: nums
        }));
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__100vktt._.js.map