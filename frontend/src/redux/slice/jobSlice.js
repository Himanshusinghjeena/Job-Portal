import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        allAdminJobs: [],
        singleJob: null,
        searchJobByText: "",
        allAppliedJobs: [],
        searchedQuery: "",
        filteredJobs: [],
        savedJobs: [],
        loading: false,
    },
    reducers: {
        setAllJobs: (state, action) => {
            // Sort jobs by date descending before storing
            state.allJobs = [...action.payload].sort((a, b) => {
                const dateA = new Date(a.date || a.createdAt || a.postedDate);
                const dateB = new Date(b.date || b.createdAt || b.postedDate);
                return dateB - dateA;
            });
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText: (state, action) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        },
        setFilteredJobs: (state, action) => {
            state.filteredJobs = action.payload;
        },
        resetFilteredJobs: (state) => {
            state.filteredJobs = state.allJobs;
        },
        setSavedJobs: (state, action) => {
            state.savedJobs = action.payload;
        },
        resetSavedJobs: (state) => {
            state.savedJobs = [];
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        }
    }
})

export const { setAllJobs, setSingleJob, setAllAdminJobs, setSearchJobByText, setAllAppliedJobs, setLoading, setSearchedQuery, setFilteredJobs, setSavedJobs, resetSavedJobs, resetFilteredJobs } = jobSlice.actions;
export default jobSlice.reducer;