import { createSlice } from "@reduxjs/toolkit";

export interface payload {
    value: number;
    name: keyof state;
}

export interface state {
    speed: number;
    attributePoints: number;
    skillPoints: number;
    bonusPoints: number;
    extraSpend: number;
    size: number;
    weightAmplifier: number;
    money: number;
    wounds: number;
    fatigue: number;
    bennies: number;
};

const initialState: state = {
    speed: 6,
    attributePoints: 5,
    skillPoints: 12,
    bonusPoints: 0,
    extraSpend: 0,
    size: 0,
    weightAmplifier: 5,
    money: 500,
    wounds: 0,
    fatigue: 0,
    bennies: 3
};

const slice = createSlice({
    name: "other",
    initialState,
    reducers: {
        setOtherStatistic(state, { payload: {value, name} }: {payload: payload}) {

            state[name] = value;

        },
        initOtherStatistics (state, { payload } : {payload: state}) {
            let i: keyof state;
            for(i in payload)
                state[i] = payload[i] ?? initialState[i];
        }
    }
});

export default slice.reducer;
export const otherActions = slice.actions;