import HomeScreen from "@/layout/HomeScreen";
import { getTypes } from "@/providers/NavigationDataProvider";

export default async function Home() {
  const types = await getTypes();
  return <HomeScreen types={types} />;
}
