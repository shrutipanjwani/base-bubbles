// app/api/streak/route.ts
import { NextRequest, NextResponse } from "next/server";

const STORAGE_PREFIX = "streak:";

interface StreakData {
  streakCount: number;
  lastGMDate: string | null;
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User Id is required" }, { status: 400 });
  }

  // Get streak data from request cookies
  const streakData = req.cookies.get(`${STORAGE_PREFIX}${userId}`)?.value;

  if (!streakData) {
    return NextResponse.json({
      streakCount: 0,
      lastGMDate: null,
    });
  }

  try {
    const data: StreakData = JSON.parse(streakData);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error parsing streak data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "User Id is required" }, { status: 400 });
  }

  try {
    const now = new Date();
    const utcNow = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );

    // Get existing streak data
    const existingData = req.cookies.get(`${STORAGE_PREFIX}${userId}`)?.value;
    let currentStreak = 0;
    let lastGMDate = null;

    if (existingData) {
      const data: StreakData = JSON.parse(existingData);
      currentStreak = data.streakCount;
      lastGMDate = data.lastGMDate ? new Date(data.lastGMDate) : null;
    }

    const utcLastGM = lastGMDate
      ? new Date(
          Date.UTC(
            lastGMDate.getUTCFullYear(),
            lastGMDate.getUTCMonth(),
            lastGMDate.getUTCDate()
          )
        )
      : null;

    let newStreakCount;

    if (!utcLastGM || utcNow > utcLastGM) {
      if (!utcLastGM || utcNow.getTime() - utcLastGM.getTime() > 86400000) {
        newStreakCount = 1;
      } else {
        newStreakCount = currentStreak + 1;
      }

      const newData: StreakData = {
        streakCount: newStreakCount,
        lastGMDate: utcNow.toISOString(),
      };

      // Create response with updated cookie
      const response = NextResponse.json({ newStreakCount });
      response.cookies.set(
        `${STORAGE_PREFIX}${userId}`,
        JSON.stringify(newData),
        {
          expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
          path: "/",
        }
      );

      return response;
    } else {
      return NextResponse.json(
        { error: "GM already clicked today" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error updating streak:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
