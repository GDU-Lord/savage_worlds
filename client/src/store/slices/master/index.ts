import { combineReducers } from "@reduxjs/toolkit";
import campaign, { campaignActions } from "./campaign";
import board, { boardActions } from "./board";

const reducers = combineReducers({ campaign, board });

export const masterActions = { ...campaignActions, ...boardActions };
export default reducers;