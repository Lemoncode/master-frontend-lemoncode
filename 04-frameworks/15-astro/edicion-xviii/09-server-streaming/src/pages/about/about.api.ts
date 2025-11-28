import { mapContentToModel } from "@content-island/api-client";
import client from "../../lib/client";
import type { About } from "./about.model";

export async function getAbout(): Promise<About> {
  const AboutContentCollection = await client.getContentList({
    contentType: "About",
  });

  const legalContentModelCollection = AboutContentCollection.map((content) =>
    mapContentToModel<About>(content),
  );

  return legalContentModelCollection[0];
}
