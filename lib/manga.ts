import axios from "axios";
import * as cheerio from "cheerio";

const baseUrl = process.env.NETTRUYEN_URL || "https://nettruyenrr.com";
const headers = {
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "accept-language": "en-US,en;q=0.9,vi;q=0.8",
  "cache-control": "no-cache",
  pragma: "no-cache",
  priority: "u=0, i",
  "sec-ch-ua":
    '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "same-origin",
  "sec-fetch-user": "?1",
  "upgrade-insecure-requests": "1",
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
  Cookie:
    "_location_evoads_=VN; _ip_evoads_=2402%3A800%3A6f61%3A36a4%3A6d4d%3A3140%3A4c28%3Ab158; _location=VN; _ga=GA1.1.687038738.1750053511; _puFirstAccess_evoads_=1750053511646; _puUsedUrls__popunder-nettruyenrr-26=; _puUsedUrls__popunder-nettruyenrr-27=; _puLifeCycleStart__popunder-nettruyenrr-27=; UGVyc2lzdFN0b3JhZ2U=%7B%7D; __pop-nettruyenrr-76_version=1; __pop-nettruyenrr-78_version=1; _puRemainingIndices__popunder-nettruyenrr-26=0; _puLastDisplay__popunder-nettruyenrr-26=1750053626941; _puLifeCycleStart__popunder-nettruyenrr-26=1750053626941; _puDisplayIndex__popunder-nettruyenrr-26=0; _puCurrentItem_evoads_=1; __pop-nettruyenrr-76_timePrevious=1750053632999; __pop-nettruyenrr-76_isShow=1; __PPU_ppucnt=1; XSRF-TOKEN=eyJpdiI6Imp0YTlVcGlpM2JPaDZVVG9cL3hxaENBPT0iLCJ2YWx1ZSI6Im10TkxNNEpzc05Qd0MwYThEZlwvbzd1enZPeER2VHlpN1Y3bndMXC9qREtuV3MxZk9HMTZlV2xEaHFaZ1U5ZnpVNSIsIm1hYyI6IjJiNmYyYmZlMGJlOTMxNWRmMzgwNTc5NTA0NjA0ODZjMmUyNmVlMTg3NzVmM2YxNjhjZGZlOWNkZWY5ZDUyNDgifQ%3D%3D; laravel_117627_session=eyJpdiI6IlF3bVBOQ2RIZnVCOFFNdkNxa2h0emc9PSIsInZhbHVlIjoiaWVLUjJYeExLUnVCNzIwNHh6K0k2SnZ5dzVsRCtnWU5KWTM0cGpqMyt3MUwzZnJ1WHhESkhocHZCclFpSEw2MSIsIm1hYyI6IjI3N2UzMWE1ZWIwZjJjYjI2MjhlYmVmNWNlZWNlZWZkY2M4MzFiYjMwYjcwNTA1MzNlZjBmOGIwZTA4MmFhNTcifQ%3D%3D; _puRemainingIndices__popunder-nettruyenrr-27=0%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C12%2C13; _puDisplayIndex__popunder-nettruyenrr-27=2; _puLastDisplay__popunder-nettruyenrr-27=1750054219010; location=VN; delay_per_life__fly_icon_3=1; times_per_life__fly_icon_3=3; _ga_9QE79X1JWX=GS2.1.s1750053511$o1$g1$t1750054490$j59$l0$h0; __pop-nettruyenrr-79_version=1; __pop-nettruyenrr-77_version=1",
};

const imageHeaders = {
  accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
  "accept-language": "en-US,en;q=0.9,vi;q=0.8",
  "cache-control": "no-cache",
  pragma: "no-cache",
  priority: "u=1, i",
  referer: "https://nettruyenrr.com/",
  "sec-ch-ua":
    '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
  "sec-fetch-dest": "image",
  "sec-fetch-mode": "no-cors",
  "sec-fetch-site": "cross-site",
  "sec-fetch-storage-access": "active",
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
};

export interface MangaItem {
  id: number | null;
  name: string | null;
  originalName: string | null;
  description: string | null;
  url: string | null;
  image: string | null;
  chapters: ChapterItem[];
}

export interface ChapterItem {
  id: number | null;
  name: string | null;
  url: string | null;
}

export interface Paginate {
  currentPage: number;
  hasPrevPage: boolean;
  hasNextpage: boolean;
  lastPage: number | null;
  perPage: number;
}

export interface MangaDetailFulled {
  id: number;
  name: string;
  image: string | null;
  authors: string[];
  categories: Category[];
  rating: string;
  ratingCount: number;
  view: number;
  status: string;
  chapters: ChapterItem[];
}

export interface Category {
  name: string;
  url: string;
}

export interface ChapterInResponse {
  comic_id: number;
  chapter_id: number;
  chapter_name: string;
  chapter_slug: string;
  updated_at: string;
}

export interface Server {
  id: number;
  name: string;
  slug: string;
  images: Image[];
}

export interface Image {
  url: string;
}

export interface Category {
  name: string;
  description?: string;
  url: string;
}

export const getListManga = async (
  page: number = 1
): Promise<Array<MangaItem>> => {
  let result: Array<MangaItem> = [];
  try {
    const response = await axios.get(`${baseUrl}/?page=${page}`, {
      headers,
    });
    const $ = cheerio.load(response.data);
    $("#ctl00_divCenter .item").each((index, element) => {
      const item = $(element);
      const name = item.find("h3")?.text()?.trim() ?? "";
      const url = item.find("h3 a")?.attr("href")?.trim() ?? "";
      const id = item.find(".comic-item").attr("data-id");
      const image = item.find(".image img").attr("data-original")?.trim() ?? "";
      const tooltip = $(element).find(".box_tootip");
      const originalName = tooltip?.find(".title").text()?.trim();
      const description = tooltip?.find(".box_text").text()?.trim();

      let chapters: ChapterItem[] = [];
      item.find(".chapter.clearfix").each((index, chapterElement) => {
        const chapterItem = $(chapterElement);
        const id = chapterItem.find("a").attr("data-id");
        const name = chapterItem.find("a").text().trim() ?? "";
        const url = chapterItem.find("a").attr("href") ?? "";
        chapters.push({
          id: id ? parseInt(id) : null,
          name,
          url: parseMangaChapterUrl(url),
        });
      });

      result.push({
        id: id ? parseInt(id) : null,
        name,
        originalName,
        description,
        url: parseMangaDetailUrl(url),
        image: parseImageUrl(image),
        chapters,
      });
    });
  } catch (error: any) {
    console.log("Error:", error.message);
  }
  return result;
};

export const getListMangaByCat = async (
  categorySlug: string,
  page: number = 1
): Promise<Array<MangaItem>> => {
  let result: Array<MangaItem> = [];
  try {
    const response = await axios.get(
      `${baseUrl}/tim-truyen/${categorySlug}?page=${page}`,
      {
        headers,
      }
    );
    const $ = cheerio.load(response.data);
    $("#ctl00_divCenter .item").each((index, element) => {
      const item = $(element);
      const name = item.find("h3")?.text()?.trim() ?? "";
      const url = item.find("h3 a")?.attr("href")?.trim() ?? "";
      const id = item.find(".comic-item").attr("data-id");
      const image = item.find(".image img").attr("data-original")?.trim() ?? "";
      const tooltip = $(element).find(".box_tootip");
      const originalName = tooltip?.find(".title").text()?.trim();
      const description = tooltip?.find(".box_text").text()?.trim();

      let chapters: ChapterItem[] = [];
      item.find(".chapter.clearfix").each((index, chapterElement) => {
        const chapterItem = $(chapterElement);
        const id = chapterItem.find("a").attr("data-id");
        const name = chapterItem.find("a").text().trim() ?? "";
        const url = chapterItem.find("a").attr("href") ?? "";
        chapters.push({
          id: id ? parseInt(id) : null,
          name,
          url: parseMangaChapterUrl(url),
        });
      });

      result.push({
        id: id ? parseInt(id) : null,
        name,
        originalName,
        description,
        url: parseMangaDetailUrl(url),
        image: parseImageUrl(image),
        chapters,
      });
    });
  } catch (error: any) {
    console.log("Error:", error.message);
  }
  return result;
};

export const getListMangaByTag = async (
  tagSlug: string,
  page: number = 1
): Promise<Array<MangaItem>> => {
  let result: Array<MangaItem> = [];
  try {
    const response = await axios.get(`${baseUrl}/tag/${tagSlug}?page=${page}`, {
      headers,
    });
    const $ = cheerio.load(response.data);
    $("#ctl00_divCenter .item").each((index, element) => {
      const item = $(element);
      const name = item.find("h3")?.text()?.trim() ?? "";
      const url = item.find("h3 a")?.attr("href")?.trim() ?? "";
      const id = item.find(".comic-item").attr("data-id");
      const image = item.find(".image img").attr("data-original")?.trim() ?? "";
      const tooltip = $(element).find(".box_tootip");
      const originalName = tooltip?.find(".title").text()?.trim();
      const description = tooltip?.find(".box_text").text()?.trim();

      let chapters: ChapterItem[] = [];
      item.find(".chapter.clearfix").each((index, chapterElement) => {
        const chapterItem = $(chapterElement);
        const id = chapterItem.find("a").attr("data-id");
        const name = chapterItem.find("a").text().trim() ?? "";
        const url = chapterItem.find("a").attr("href") ?? "";
        chapters.push({
          id: id ? parseInt(id) : null,
          name,
          url: parseMangaChapterUrl(url),
        });
      });

      result.push({
        id: id ? parseInt(id) : null,
        name,
        originalName,
        description,
        url: parseMangaDetailUrl(url),
        image: parseImageUrl(image),
        chapters,
      });
    });
  } catch (error: any) {
    console.log("Error:", error.message);
  }
  return result;
};

export const getListMangaInSearch = async (
  page: number = 1,
  keyword: string
): Promise<Array<MangaItem>> => {
  let result: Array<MangaItem> = [];
  try {
    const response = await axios.get(
      `${baseUrl}/tim-truyen/?page=${page}&keyword=${keyword}`,
      {
        headers,
      }
    );
    const $ = cheerio.load(response.data);
    $("#ctl00_divCenter .item").each((index, element) => {
      const item = $(element);
      const name = item.find("h3")?.text()?.trim() ?? "";
      const url = item.find("h3 a")?.attr("href")?.trim() ?? "";
      const id = item.find(".comic-item").attr("data-id");
      const image = item.find(".image img").attr("data-original")?.trim() ?? "";
      const tooltip = $(element).find(".box_tootip");
      const originalName = tooltip?.find(".title").text()?.trim();
      const description = tooltip?.find(".box_text").text()?.trim();

      let chapters: ChapterItem[] = [];
      item.find(".chapter.clearfix").each((index, chapterElement) => {
        const chapterItem = $(chapterElement);
        const id = chapterItem.find("a").attr("data-id");
        const name = chapterItem.find("a").text().trim() ?? "";
        const url = chapterItem.find("a").attr("href") ?? "";
        chapters.push({
          id: id ? parseInt(id) : null,
          name,
          url: parseMangaChapterUrl(url),
        });
      });

      result.push({
        id: id ? parseInt(id) : null,
        name,
        originalName,
        description,
        url: parseMangaDetailUrl(url),
        image: parseImageUrl(image),
        chapters,
      });
    });
  } catch (error: any) {
    console.log("Error:", error.message);
  }
  return result;
};

export const getListCategory = async (): Promise<Category[]> => {
  try {
    const response = await axios.get(`${baseUrl}/?page=1`, {
      headers,
    });
    const $ = cheerio.load(response.data);

    let categories: Category[] = [];
    $(".main-menu .dropdown-menu.megamenu .clearfix li").each(
      (index, element) => {
        const item = $(element).find("a");
        const name = item?.text()?.trim() ?? "";
        const description = item?.attr("data-title")?.trim() ?? "";
        const url = item?.attr("href")?.trim() ?? "";
        if (index != 0) {
          categories.push({
            name,
            description,
            url: parseCategoryUrl(url),
          });
        }
      }
    );
    return categories;
  } catch (error) {
    console.log("Error: ", error);
    return [];
  }
};

export const getPaginate = async (
  currentPage: number = 1,
  keyword: string | null = null
): Promise<Paginate> => {
  const response = await axios.get(
    keyword
      ? `${baseUrl}/tim-truyen/?page=1&keyword=${keyword}`
      : `${baseUrl}/?page=1`,
    {
      headers,
    }
  );
  const $ = cheerio.load(response.data);
  const lastPagePlanText = $(
    ".pagination .page-item:nth-last-child(2)"
  )?.text();
  const lastPage = lastPagePlanText ? parseInt(lastPagePlanText) : null;
  return {
    currentPage,
    hasPrevPage: currentPage > 1,
    hasNextpage: lastPage ? currentPage < lastPage : false,
    lastPage,
    perPage: 22,
  };
};

export const parseImageUrl = (url: string) => {
  const regex = /https:\/\/(.*)\/nettruyen\/(.*)/gm;
  const result = regex.exec(url);
  if (!result) {
    return "";
  }
  const server = result[1];
  const path = result[2];
  if (!server || !path) {
    return "";
  }
  return process.env.APP_URL + "/media/" + server + "/manga/" + path;
};

export const parseMangaDetailUrl = (url: string) => {
  const regex = /https:\/\/.*\/truyen-tranh\/(.*)/gm;
  const result = regex.exec(url);
  if (!result) {
    return "";
  }
  const slug = result[1];
  if (!slug) {
    return "";
  }
  return process.env.APP_URL + "/api/manga/" + slug;
};

export const parseMangaChapterUrl = (url: string) => {
  const regex = /https:\/\/.*\/truyen-tranh\/(.*)\/chapter-(.*)\/(.*)/gm;
  const result = regex.exec(url);
  if (!result) {
    return "";
  }
  const mangaSlug = result[1];
  const chapterSlug = result[2];
  const chapterId = result[3];
  if (!mangaSlug || !chapterId) {
    return "";
  }
  return (
    process.env.APP_URL +
    "/api/manga/" +
    mangaSlug +
    "/chapter/chapter-" +
    chapterSlug +
    "/" +
    chapterId
  );
};

export const parseStatus = (status: string) => {
  switch (status) {
    case "Đang tiến hành":
      return "in-progress";

    case "Hoàn thành":
      return "completed";

    default:
      return "";
  }
};

export const parseCategoryUrl = (url: string) => {
  const regex = /.*\/tim-truyen\/(.*)/gm;
  const result = regex.exec(url);
  if (!result) {
    return parseTagUrl(url);
  }
  const slug = result[1];
  if (!slug) {
    return "";
  }
  return process.env.APP_URL + "/api/categories/" + slug;
};

export const parseTagUrl = (url: string) => {
  const regex = /.*\/tag\/(.*)/gm;
  const result = regex.exec(url);
  if (!result) {
    return "";
  }
  const slug = result[1];
  if (!slug) {
    return "";
  }
  return process.env.APP_URL + "/api/tag/" + slug;
};

export const fetchRealImage = async (
  server: string,
  path: string
): Promise<{
  data: string;
  contentType: string;
  contentLength: string;
} | null> => {
  try {
    const response = await axios.get(`https://${server}/nettruyen/${path}`, {
      headers: imageHeaders,
      responseType: "arraybuffer",
    });
    const contentType = response.headers["content-type"] || "image/jpeg";
    const contentLength = response.headers["content-length"] || "1000";
    return {
      data: response.data,
      contentType,
      contentLength,
    };
  } catch (error) {
    return null;
  }
};

export const getManaDetail = async (
  slug: string
): Promise<MangaDetailFulled | null> => {
  try {
    const response = await axios.get(`${baseUrl}/truyen-tranh/${slug}`, {
      headers,
    });
    const $ = cheerio.load(response.data);

    if (!$("#ctl00_Body").hasClass("comic-detail")) {
      throw new Error("Slug is invalid");
    }
    const id = $(".detail-info .star")?.attr("data-id");
    const name = $("h1.title-detail")?.text().trim() ?? "";
    const image = $(".detail-info .image-thumb")?.attr("data-src") ?? "";

    const authorPlanText =
      $(".list-info .author.row .col-xs-8")?.text().trim() ?? "";
    let authors: string[] = authorPlanText.split(", ");

    let categories: Category[] = [];
    $(".list-info .kind.row .col-xs-8 a").each((index, element) => {
      const item = $(element);
      const url = item?.attr("href") ?? "";
      const name = item?.text() ?? "";
      categories.push({
        name,
        url: parseCategoryUrl(url),
      });
    });

    const ratingValue = $('[itemprop="ratingValue"]')?.text()?.trim() ?? 0;
    const bestRating = $('[itemprop="bestRating"]')?.text()?.trim() ?? 0;
    const ratingCount = $('[itemprop="ratingCount"]')?.text()?.trim() ?? 0;

    const viewPlanText =
      $(".list-info li:nth-last-child(1)")?.find(".col-xs-8")?.text()?.trim() ??
      "";
    const view = viewPlanText ? parseInt(viewPlanText.replaceAll(".", "")) : 0;
    const status =
      $(".list-info .status.row")?.find(".col-xs-8")?.text()?.trim() ?? "";

    const regex = /(.*)-(.[0-9]*)/gm;
    const parseSlug = regex.exec(slug);
    if (!parseSlug) {
      throw new Error("Slug is invalid");
    }
    const mangaSlug = parseSlug[1];
    const mangaId = parseSlug[2];

    const chapterResponse = await axios.get(
      `${baseUrl}/Comic/Services/ComicService.asmx/ChapterList?slug=${mangaSlug}&comicId=${mangaId}`,
      {
        headers,
      }
    );
    const listChapters = chapterResponse.data.data as ChapterInResponse[];
    let chapters: ChapterItem[] = [];
    for (const chapter of listChapters) {
      chapters.push({
        id: chapter.chapter_id,
        name: chapter.chapter_name,
        url:
          process.env.APP_URL +
          "/api/manga/" +
          "onepunch-man" +
          "/chapter/" +
          chapter.chapter_slug +
          "/" +
          chapter.chapter_id,
      });
    }

    return {
      id: id ? parseInt(id) : -1,
      name,
      image: parseImageUrl(image),
      authors,
      categories,
      rating: `${ratingValue}/${bestRating}`,
      ratingCount: ratingCount ? parseInt(ratingCount) : 0,
      view,
      status: parseStatus(status),
      chapters,
    };
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export const getChapterDetail = async (
  mangaSlug: string,
  chapters: string[]
) => {
  try {
    const response = await axios.get(
      `${baseUrl}/truyen-tranh/${mangaSlug}/${chapters.join("/")}`,
      {
        headers,
      }
    );
    const $ = cheerio.load(response.data);
    if (!$("body").hasClass("chapter-detail")) {
      throw new Error("Slug is invalid!");
    }

    let servers: Server[] = [];
    $("[data-server]").each((index, element) => {
      const item = $(element);
      const id = item.attr("data-server");
      const name = item.text()?.trim() ?? "";
      const slug = "sv" + id;

      let images: Image[] = [];
      $(".page-chapter img").each((index, element) => {
        const image = $(element).attr("data-" + slug) ?? "";
        images.push({
          url: parseImageUrl(image),
        });
      });

      servers.push({
        id: id ? parseInt(id) : 0,
        name,
        slug,
        images,
      });
    });

    return servers;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};
