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
    weightAmplifier: number;
    money: number;
    wounds: number;
    fatigue: number;
    bennies: number;
};

const slice = createSlice({
    name: "other",
    initialState: {
        speed: 6,
        attributePoints: 5,
        skillPoints: 12,
        bonusPoints: 0,
        weightAmplifier: 5,
        money: 500,
        wounds: 0,
        fatigue: 0,
        bennies: 3
    } as state,
    reducers: {
        setOtherStatistic(state, { payload: {value, name} }: {payload: payload}) {

            state[name] = value;

        },
        initOtherStatistics (state, { payload } : {payload: state}) {
            return payload;
        }
    }
});

export default slice.reducer;
export const otherActions = slice.actions;