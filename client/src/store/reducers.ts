import { combineReducers } from "@reduxjs/toolkit";
import sheet, { sheetActions } from "./slices/sheet";
import master, { masterActions } from "./slices/master";
import summary, { summaryActions } from "./slices/summary";

const reducers = combineReducers({ sheet, master, summary });

export type RootState = ReturnType<typeof reducers>;
export const actions = { ...sheetActions, ...masterActions, ...summaryActions };
export default reducers;