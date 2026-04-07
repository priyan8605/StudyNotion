import axios from "axios"

// using create() we can call for any request such as get,put,post

export const axiosInstance=axios.create({});

export const apiConnector=(method,url,bodyData,headers, params)=>{
    return axiosInstance({
          method:`${method}`,
          url:`${url}`,
          data:bodyData?bodyData:null,
          headers:headers?headers:null,
          params:params?params:null,

    }
    )
}