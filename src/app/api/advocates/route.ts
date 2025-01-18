import { ilike, or, SQL } from "drizzle-orm";
import { NextRequest } from "next/server";
import db from "../../../db";
import { advocates } from "../../../db/schema";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let searchTerm = searchParams?.get("search");

  // Set up filters if a search term was passed in
  let filters: SQL[] = [];
  if(searchTerm) {
    searchTerm = `%${searchTerm}%`;
    filters = [
      ilike(advocates.firstName, searchTerm),
      ilike(advocates.lastName, searchTerm),
      ilike(advocates.city, searchTerm),
      ilike(advocates.degree, searchTerm),
      // ilike(advocates.specialties, searchTerm), // TODO handle filtering json
      // ilike(advocates.yearsOfExperience, searchTerm), // TODO handle filtering int
    ];
  }

  const data = await db.select().from(advocates).where(or(...filters));

  return Response.json({ data });
}
