import { fetchRealImage } from "@/lib/manga";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname.toString();
    const regex = /media\/(.*)\/manga\/(.*)/gm;
    const result = regex.exec(path);
    if (!result) {
      throw new Error("Not found.");
    }

    const server = result[1];
    const realPath = result[2];
    if (!server || !realPath) {
      throw new Error("Not found.");
    }

    const response = await fetchRealImage(server, realPath);
    if (!response?.contentType) {
      throw new Error("Content-Type not found.");
    }
    return new Response(response.data, {
      headers: {
        "Content-Type": response.contentType,
        "Cache-Control": `public, max-age=${response.contentLength}`,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response("Not found.", {
        status: 404,
      });
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
