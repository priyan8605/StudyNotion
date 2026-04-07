const Category=require('../models/category');
const { populate } = require('../models/SubSection');

// create a handler function for "Category"
// Note==>category sirf Admin bna skta hai

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

exports.createCategory=async(req,res)=>{
    try{
        // 1>fetch name,description from req.body
        const {name,description}=req.body;


        // 2>perform validation on fetched data
        if(!name)
        {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        // 3>create entry in DB
        const categoryDetails=await Category.create({
            name:name,
            description:description
        })
        console.log(`categoryDetails => ${categoryDetails}`);
         return res.status(200).json({
            success:true,
            message:"Category created successfully"
        })



    }
    catch(error)
    {
        
      return res.status(500).json({
        success: false,
        message: "Can't create a category",
        error: error.message
      });
    
    }
}

// getAllCategory handler function 
// exports.showAllCategory=async(req,res)=>{
//     try{
       
//         const allCategory=await Category.find({},{name:true,description:true});
//          // find({}) koi criteria ke basis prr Category me se entry nhi layega 
//         //  blki jitna bhi entry pda hai Category ke andr wo sbb lee krr aajayega 
//         // just make sure one thing ki hrr ekk entry ke andr name and description
//         //  hona hi chahiye =>Select name,description from  table Category
//         res.status(200).json({
//              success:true,
//              message:"All Category returned successfully",
//              data:allCategory
//         });
        

//     }
//     catch(error)
//     {
//         console.log(`Error occured in showAllCategory()=> ${error}`);
//         return res.status(500).json({
//             success:false,
//             message:"Can't show allCategory"
//         })
//     }
// }
exports.showAllCategory = async (req, res) => {
  try {
    const allCategories = await Category.find().populate("courses");
    console.log("ALL CATEGORIES", allCategories);
    // Return all categories (including those without published courses)
    res.status(200).json({
      success: true,
      data: allCategories,
    });  // to show all category including those category  jisme published course nhi hai

    // Return only categories that have at least one published course
    //     const allCategories = await Category.find().populate("courses");
    // const categoriesWithPublishedCourses = allCategories.filter((category) =>
    //   category.courses.some((course) => course.status === "Published")
    // );
    // res.status(200).json({
    //   success: true,
    //   data: categoriesWithPublishedCourses,
    // });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// categoryPageDetails
// agr humne "Python" category dala to "Python" category se related jitne bhi "Courses" hai voo 
// sbb show hone lgene such as  "trending python courses","popular python corses","frequently bought python courses"

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingsAndReviews",
      })
      .exec();

    if (!selectedCategory) {
      console.log("Category not found.");
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    if (selectedCategory.courses.length === 0) {
      console.log("No courses found for the selected category.");
      return res.status(200).json({
        success: true,
        message: "No courses found for the selected category.",
      });
    }

    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    });
    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec();
    console.log();

    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec();
    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
// exports.categoryPageDetails = async (req, res) => {
//     try {
//       // 1>fetch categoryId from req.body so that we can see courses related toa category
//       const { categoryId } = req.body;
  
//     // 2>  get courses for the specified categoryId
//       const selectedCategory = await Category.findById(categoryId)//categoryId se related jo Category hai oose find krr ke lee aao
//         .populate( {
//           // "courses",
//         //Category model ya document me jo "courses" property hai jisme "Course" document
//           // ka objectId pda hai oose populate krega 
//           path: "courses",
//           match: { status: "Published" }, // sirf "Published" status wale courses hi show honge
//           populate:"ratingsAndReviews" // "Course" document me jo "ratingsAndReviews" property hai jisme "RatingAndReview" document ka objectId pda hai oose populate krega
//         }
//         )
//         .exec();
  
//       console.log("SELECTED COURSE", selectedCategory);
  
//     //   handle the case when category is not found
//       if (!selectedCategory) 
//         {
//           // Agr user ne Python category ka course maanga and Python category  ka course exist hi nhi 
//           // krr rha ho tbb if() execute
//         console.log("Category not found.");
//         return res
//           .status(404)
//           .json({
//              success: false, 
//              message: "Data not found" 
//             });
//       }
  
    

//     //    get course for other categories
//       const categoriesExceptSelected = await Category.find({
//         _id: { $ne: categoryId },
//       })
//       .populate('courses')//populate kro "courses" property ko mtlb "Course" ka actual document show kro instead of objectId
//       .exec();
     
     
      
//       let differentCategory = await Category.findOne(
//         categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
//           ._id
//       )
//         .populate({
//           path: "courses",
//           match: { status: "Published" },
//         })
//         .exec()
//       console.log()
    
  
//     // get top selling courses across all categories
//       const allCategories = await Category.find()
//         .populate({
//           path: "courses",
//           match: { status: "Published" },
//         })
//         .exec();
//       // by sir:-  const allCategories = await Category.find().populate('courses')
//       const allCourses = allCategories.flatMap((category) => category.courses);
//       console.log("ALL COURSES", allCourses);
//       // sort the courses based on the 'sold' field in descending order and get top 10
//       const mostSellingCourses = allCourses
//         .sort((a, b) => b.sold - a.sold)
//         .slice(0, 10);
//       console.log("MOST SELLING COURSES", mostSellingCourses);
  
//      return res.status(200).json({
//         success: true,
//         data: {
//           selectedCategory,
//           differentCategory,
//           mostSellingCourses,
//         },
//       });
//     } 
//     catch (error)
//     {
//       console.log(`Error in categoryPageDetails() =>${error}`);
//       return res.status(500).json({
//         success: false,
//         message: "Internal server error",
//         error: error.message,
//       });
//     }
//   };