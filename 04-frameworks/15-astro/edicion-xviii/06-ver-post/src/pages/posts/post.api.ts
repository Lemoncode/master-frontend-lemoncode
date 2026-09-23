import client from "../../lib/client";
import type { SinglePost } from "./post.model";
import { mapContentToModel } from "@content-island/api-client";

export async function getPosts(): Promise<SinglePost[]> {
  const response = await client.getContentList({
    contentType: "Post",
  });

  const posts = response.map((content) =>
    mapContentToModel<SinglePost>(content)
  );

  return posts;
}
