import { combineReducers } from "@reduxjs/toolkit";
import sheet, { sheetActions } from "./slices/sheet";
import master, { masterActions } from "./slices/master";

const reducers = combineReducers({ sheet, master });

export type RootState = ReturnType<typeof reducers>;
export const actions = { ...sheetActions, ...masterActions };
export default reducers;