import { getListManga, getPaginate } from "@/lib/manga";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const pagePlanText = request.nextUrl.searchParams.get("page");
    const page: number = pagePlanText ? parseInt(pagePlanText) : 1;

    const paginate = await getPaginate(page);
    if ((paginate.lastPage && page > paginate.lastPage) || page < 1 || !page) {
      throw new Error("The page is invalid!");
    }

    const data = await getListManga(page);

    return NextResponse.json({
      data,
      paginate,
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
