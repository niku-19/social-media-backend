import cloudinary from "cloudinary";

class CloudinaryServices {
  async uploadImage(image, path) {
    //cloudinary configuration

    cloudinary.config({
      cloud_name: "dijuuvepx",
      api_key: "561467826254498",
      api_secret: "nFHwcmWDmRHhKx80vJw6CPv42Gc",
    });

    //upload image to cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream(
          {
            resource_type: "image",
            public_id: path,
            format: "png",
          },
          (err, result) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              resolve(result);
            }
          }
        )
        .end(image);
    });

    return result.secure_url;
  }
}

export default new CloudinaryServices();
