import { createSlice } from "@reduxjs/toolkit";

export interface payload {
    value: boolean;
    name: keyof state;
}

export interface state {
    text: boolean;
    other: boolean;
    attributes: boolean;
    skills: boolean;
    derived: boolean;
    edges: boolean;
    hindrances: boolean;
    tools: boolean;
    armor: boolean;
    weapons: boolean;
};

const slice = createSlice({
    name: "tabs",
    initialState: {
        text: true,
        other: true,
        attributes: true,
        skills: true,
        derived: true,
        edges: true,
        hindrances: true,
        tools: true,
        armor: true,
        weapons: true
    } as state,
    reducers: {
        updateTab(state, { payload: {value, name} }: {payload: payload}) {

            state[name] = value;

        }
    }
});

export default slice.reducer;
export const tabsActions = slice.actions;