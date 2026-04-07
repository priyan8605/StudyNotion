
const Tag=require('../models/tags');
exports.createTag=async(req,res)=>{
    try{
        // fetch name and description from req.body but here right now we are not fetching course because
        // we have assumed that right now we are  creating course.But whenever course will be created we will need
        // tag so we will create tag first and then course
        const {name,description}=req.body;
        // validation
       if(!name||!description)
         {
            return res.status(400).json({
                success:false,
                message:"Please provide all the details"
            })
         }
        //  create tag an entry in db
        const tagDetails=await Tag.create({
            name:name,
            description:description
        })
        console.log(`TagDetails is = ${tagDetails}`);
        // return response
        return res.status(200).json({
            success:true,
            message:"Tag created successfully",
            
        })
    }
    catch(error)
    {
        console.log(`Error in createTag is = ${error}`);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while creating tag"
        })
    }
}

// getAllTags handler
exports.getAllTags=async(req,res)=>{
    try{
        // fetch all tags from db
        const allTags=await Tag.find(
            {
                // here we are not fetching tags from db on basis of any condition or criteria
                // so this is left empty
            },
            {
                // whichever tag are getting fetched that must have name and description
                name:true,
                description:true,
               
            }
        );
        // return response
        return res.status(200).json({
            success:true,
            message:"Tags fetched successfully",
            data:allTags
        })
    }       
    catch(error)            
    {
        console.log(`Error in getAllTags is = ${error}`);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while fetching allTags"
        })
    }   
}