import {toast} from "react-hot-toast"
import { setProgress } from "../../slices/loadingBarSlice";
import { apiConnector } from '../apiconnector';
import { catalogData } from '../aips';

export const getCatalogPageData = async (categoryId) => {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector(
      "POST",
      catalogData.CATALOGPAGEDATA_API,
      {
        categoryId: categoryId,
      }
    )
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Catagory page data.")
    }
    result = response?.data
  } catch (error) {
    console.log("CATALOGPAGEDATA_API API ERROR............", error)
    toast.error(error.message)
    result = error.response?.data
  }
  toast.dismiss(toastId)
  return result
}

// export const getCatalogPageData = async (categoryId) => {
//   const toastId = toast.loading("Loading...")
//   let result = []
//   try {
//     // apiConnector(method, url, body = null, customHeaders = null) use krke API call kr rhe hai
//     const response = await apiConnector(
//       "POST",
//       catalogData.CATALOGPAGEDATA_API,
//       {
//         categoryId: categoryId,// categoryId ko body me bhej rhe hai taki backend me categoryId ke basis pe data fetch kr ske 
//       }
//     )
//     if (!response?.data?.success) {
//       throw new Error("Could Not Fetch Catagory page data.")
//     }
//     result = response?.data
//   } catch (error) {
//     console.log("CATALOGPAGEDATA_API API ERROR............", error)
//     toast.error(error.message)
//     result = error.response?.data
//   }
//   toast.dismiss(toastId)
//   return result
// }