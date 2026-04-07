import {createSlice} from "@reduxjs/toolkit"

// Before creating a slice we define a initial State
const initialState={
    signupData:null,
    loading:false,//using this we will decide whether to make spinner or loader visible or not
    token:localStorage.getItem("token")?
    JSON.parse(localStorage.getItem("token")):null
    //This checks if a token is stored in the browser's localStorage.
    //If it exists, it parses the token from a string to a JavaScript object using JSON.parse.
    //If not, it sets token to null.

}

// create slice
const authSlice= createSlice({
    
    name:"auth",//name of the slice created by createSlice()
    
    initialState:initialState,//Sets the initial state of the slice. initialState is likely defined elsewhere in your code. 
    // It represents the default state for this slice.

    reducers:{
        setToken(state,value){
            // setToken is a reducer function. It takes the current state and an action object.

            state.token=value.payload;
            //value.payload is the data dispatched with the action. In this case, it’s expected to be the new token value.
            //state.token = value.payload; updates the token property in the state with the new value.
        },

        setSignupData(state, value) {
            state.signupData = value.payload;
          },
          setLoading(state, value) {
            state.loading = value.payload;
          },
    }
})

// export slice
export const {setSignupData, setLoading, setToken}=authSlice.actions;
export default authSlice.reducer;