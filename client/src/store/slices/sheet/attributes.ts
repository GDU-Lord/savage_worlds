import { createSlice } from "@reduxjs/toolkit";

export type attribute = "agility" | "strength" | "smarts" | "spirit" | "vigor";

export type state = {
    [key in attribute]: level
};

export interface payload { 
    name: attribute;
    value: level;
};

const slice = createSlice({
    name: "attributes",
    initialState: {
        agility: [4, 0],
        strength: [4, 0],
        smarts: [4, 0],
        spirit: [4, 0],
        vigor: [4, 0],
    } as state,
    reducers: {
        setAttribute(state, { payload }: { payload: payload }) {
            
            state[payload.name] = payload.value;

        },
        initAttributes (state, { payload } : {payload: state}) {
            return payload;
        }
    }
});

export default slice.reducer;
export const attributesActions = slice.actions;