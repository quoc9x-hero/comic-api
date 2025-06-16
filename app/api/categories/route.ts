import { getListCategory } from "@/lib/manga";
import { getCachedData } from "@/lib/upstash";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getCachedData("categories", {}, async () => {
      return await getListCategory();
    });
    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        }
      );
    } else {
      return NextResponse.json(
        {
          message: "Server error",
        },
        {
          status: 400,
        }
      );
    }
  }
}
