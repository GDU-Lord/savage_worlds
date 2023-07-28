import { createSlice } from "@reduxjs/toolkit";

export interface state {
    wounds: number,
    shaken: boolean;
    voulnerable: boolean;
    distracted: boolean;
    notes: string;
};

const slice = createSlice({
    name: "summary",
    initialState: {
        wounds: 0,
        shaken: false,
        voulnerable: false,
        distracted: false,
        notes: ""
    } as state,
    reducers: {
        
        setWounds (state, { payload }: { payload: number }) {
            state.wounds = Math.max(0, payload);
        },

        setDistracted (state, { payload }: { payload: boolean }) {
            state.distracted = payload;
        },

        setVoulnerable (state, { payload }: { payload: boolean }) {
            state.voulnerable = payload;
        },

        setShaken (state, { payload }: { payload: boolean }) {
            state.shaken = payload;
        },

        setNotes (state, { payload }: { payload: string }) {
            state.notes = payload;
        }

    }
});

export default slice.reducer;
export const summaryActions = slice.actions;