import { GET_TYPES } from "../lib/queries";
import { client } from "../lib/apollo-client";
import { TypesData } from "../lib/types";
import TypesSidebarClient from "./TypesSidebarClient";

async function getTypes() {
  try {
    const { data } = await client.query<TypesData>({
      query: GET_TYPES,
    });
    return data.types || [];
  } catch (error) {
    console.error("Error fetching types:", error);
    return [];
  }
}

export default async function TypesSidebar() {
  const types = await getTypes();

  return <TypesSidebarClient types={types} />;
}
