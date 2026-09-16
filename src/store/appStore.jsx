import { configureStore } from "@reduxjs/toolkit";
import astroReducer from "./AstroSlice";
import commentReducer from "./CommentsSlice";
import userReducer from "./userSlice";
import followReducer from "./followSlice";
import configAppSliceReducer from "./configAppSlice";
import birthDetailsReducer from "./birthDetailsSlice";


const appStore = configureStore({
    reducer:{
        astro : astroReducer,
        comment : commentReducer,
        user: userReducer,
        follow: followReducer,
        configApp: configAppSliceReducer,
        birthDetails: birthDetailsReducer,
    }
})
export default appStore;