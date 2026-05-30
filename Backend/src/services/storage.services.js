import ImageKit from "@imagekit/nodejs";
import config from "../config/config.js";

/* Initializing ImageKit */
const client = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

export const uploadImage = async ({ fileName, buffer, folder = "snitch" }) => {
  try {
    const result = await client.files.upload({
      file: await ImageKit.toFile(buffer),
      fileName,
      folder,
    });

    return result;
  } catch (error) {
    throw error;
  }
};
