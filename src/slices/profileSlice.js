import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    user:localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):null,
    loading:false,
}

const profileSlice =createSlice({
    name:"profile",
    initialState: initialState,
    reducers:{
        setUser(state,value){
            state.user=value.payload
            localStorage.setItem("user",JSON.stringify(value.payload));
        },
        setLoading(state,value){
            state.loading=value.payload
        },
    }
});

export const {setUser,setLoading}=profileSlice.actions;
export default profileSlice.reducer;


// import {createSlice} from "@reduxjs/toolkit"

// // Before creating a slice we define a initial State
// const initialState={
//     user:null,

// }

// // create slice
// const profileSlice= createSlice({
//     name:"profile",
//     initialState:initialState,
//     reducers:{
//         setUser(state,value){
//             state.user=value.payload;
//         }
//     }
// })

// // export slice
// export const {setUser}=profileSlice.actions;
// export default profileSlice.reducer;
