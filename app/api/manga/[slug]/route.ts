import { getManaDetail } from "@/lib/manga";
import { getCachedData } from "@/lib/upstash";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  slug: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const promiseParams = await params;
    if (!promiseParams.slug) {
      throw new Error("The slug is invalid!");
    }

    const data = await getCachedData(
      "manga-detail",
      promiseParams,
      async () => {
        const data = await getManaDetail(promiseParams.slug);
        if (!data) {
          throw new Error("Data not found!");
        }

        return data;
      }
    );
    return NextResponse.json(data, { status: 200 });
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
