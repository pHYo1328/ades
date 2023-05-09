const config = require("./config");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const chalk = require("chalk");

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

module.exports.destroyFromCloudinary = async (publicID) => {
  console.log(chalk.yellow(publicID));
  console.log(chalk.blue("destroyFromCloudinary called"));
  // return new Promise(async (resolve, reject) => {
  //   console.log(chalk.blue('async running'));
  //   const result = await cloudinary.uploader.destroy(publicID);
  //   console.log(chalk.yellow(result));
  //   if (result.result === 'not found') {
  //     return reject({ status: 'fail', data: result });
  //   } else {
  //     return resolve({ status: 'success', data: result });
  //   }
  // });
  try {
    console.log(chalk.blue("async running"));
    const result = await cloudinary.uploader.destroy(publicID);
    console.log(chalk.yellow(result));
    if (result.result === "not found") {
      return { status: "fail", data: result };
    } else {
      return { status: "success", data: result };
    }
  } catch (error) {
    throw error;
  }
};

module.exports.uploadStreamToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    console.log(chalk.yellow(buffer));
    console.log(chalk.blue("uploadStreamToCloudinary called"));
    const streamDestination = cloudinary.uploader.upload_stream(
      {
        folder: "ades",
        allowed_formats: "png,jpg",
        resource_types: "image",
      },
      async (error, result) => {
        console.log(chalk.blue("async running"));
        if (result) {
          console.log(chalk.yellow(result));
          const cloudinaryFileData = {
            url: result.url,
            publicID: result.public_id,
            status: "success",
          };
          console.log(chalk.green("success cloudinary"));
          return resolve({ status: "success", data: cloudinaryFileData });
        }
        if (error) {
          console.error(chalk.red(error));
          reject({ status: "fail", data: error });
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(streamDestination);
  });
};
