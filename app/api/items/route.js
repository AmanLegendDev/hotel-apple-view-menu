  import { connectDB } from "@/lib/db";
  import MenuItem from "@/models/MenuItems";
  import { NextResponse } from "next/server";
  import cloudinary from "@/lib/cloudinary";
  import slugify from "slugify";

  export const dynamic = "force-dynamic";
  export const revalidate = false;


  export async function POST(req) {
    try {
      await connectDB();
      
      const formData = await req.formData();

      const name = formData.get("name");
      const price = formData.get("price");
      const description = formData.get("description");
      const category = formData.get("category");
      const file = formData.get("image");

  let uploadedImageUrl = "";

  if (file && file.size > 0) {
    if (!file.type || !file.type.startsWith("image/")) {
      throw new Error("Only image files are allowed");
    }

    let bytes;
try {
  bytes = await file.arrayBuffer();
} catch (e) {
  throw new Error("Image buffer error");
}

    const buffer = Buffer.from(bytes);

    const mimeType = file.type || "image/jpeg";
const ext = mimeType.split("/")[1];


    const uploadRes = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "menu-items",
          resource_type: "image",
          format: ext,
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );

      stream.end(buffer);
    });

    uploadedImageUrl = uploadRes.secure_url;
  }





      const slug = slugify(name, { lower: true });

      const item = await MenuItem.create({
        name,
        price,
        description,
        category,
        slug,
        image: uploadedImageUrl,
      });

      return NextResponse.json(item);
    } catch (err) {
      console.error("ITEM POST ERROR FULL:", err);
  return NextResponse.json({ error: err.message }, { status: 500 });

    }
  }

  export async function GET(req) {
    try {
      await connectDB();

      const { searchParams } = new URL(req.url);

      // FAST COUNT MODE
      if (searchParams.get("count") === "true") {
        const count = await MenuItem.countDocuments();
        return NextResponse.json({ count });
      }

      // DEFAULT - fetch full items
      const items = await MenuItem.find()
        .populate("category")
        .lean();

      return NextResponse.json(items);
    } catch (err) {
      console.error("ITEM GET ERROR:", err);
      return NextResponse.json([], { status: 200 });
    }
  }


