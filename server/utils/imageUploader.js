const cloudinary=require("cloudinary").v2

exports.uploadImageToCloudinary=async(file,folder,height,quality)=>{
  const options={folder};
  if(height)
  {
    options.height=height;
  }
  if(quality)
  {
    options.quality=quality;
  }  
  options.resource_type="auto";//means that Cloudinary will automatically determine the resource type based on the provided URL or public ID.
   console.log(`options in imageUploader() => ${options}`);
  return await cloudinary.uploader.upload(file.tempFilePath,options);
}