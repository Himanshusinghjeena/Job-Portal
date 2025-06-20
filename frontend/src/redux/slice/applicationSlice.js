import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name:"application",
    initialState:{
        applicants:[],
        loading:false
    },
    reducers:{
        setAllAplicants:(state,action)=>{
            state.applicants=action.payload
        },
        setLoading:(state,action)=>
            {
                state.loading=action.payload
                }
    }
})


export const {setAllAplicants, setLoading} = applicationSlice.actions
export default applicationSlice.reducer;