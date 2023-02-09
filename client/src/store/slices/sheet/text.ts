import { createSlice } from "@reduxjs/toolkit";

export interface payload {
    value: string;
    name: keyof state;
}

export interface state {
    playerName: string;
    name: string;
    race: string;
    token: string;
};

const slice = createSlice({
    name: "text",
    initialState: {
        playerName: "",
        name: "",
        race: "",
        token: ""
    } as state,
    reducers: {
        setTextStatistic(state, { payload: {value, name} }: {payload: payload}) {

            state[name] = value;

        },
        initTextStatistics (state, { payload } : {payload: state}) {
            return payload;
        }
    }
});

export default slice.reducer;
export const textActions = slice.actions;