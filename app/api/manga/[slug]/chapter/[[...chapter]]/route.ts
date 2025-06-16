import { getChapterDetail } from "@/lib/manga";
import { getCachedData } from "@/lib/upstash";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  slug: string;
  chapter: string[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const parseParams = await params;

    const data = await getCachedData(
      "manga-chapter-list",
      { ...parseParams },
      async () => {
        const data = await getChapterDetail(
          parseParams.slug,
          parseParams.chapter
        );
        if (!data) {
          throw new Error("Data not found");
        }

        return data;
      }
    );

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
