"use server";

import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function createPost(content: string, image: string) {
  try {
    const userId = await getDbUserId();
    const post = await prisma.post.create({
        data:{
            content, 
            image,
            authorId: userId
        },
    });
    revalidatePath("/"); // revalidate the home page
    return {success: true, post};
  } catch (e) {
    console.error("Failed to create post:", e);
    return { success: false, error: "Failed to create post" };
  }
}
