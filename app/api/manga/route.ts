import { getListManga, getPaginate } from "@/lib/manga";
import { getCachedData } from "@/lib/upstash";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const pagePlanText = request.nextUrl.searchParams.get("page");
    const page: number = pagePlanText ? parseInt(pagePlanText) : 1;

    const data = await getCachedData("manga-list", { page }, async () => {
      const paginate = await getPaginate(page);
      if (
        (paginate.lastPage && page > paginate.lastPage) ||
        page < 1 ||
        !page
      ) {
        throw new Error("The page is invalid!");
      }

      const data = await getListManga(page);

      return {
        data,
        paginate,
      };
    });
    return NextResponse.json(data);
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
