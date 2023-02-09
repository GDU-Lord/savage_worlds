import { createSlice } from "@reduxjs/toolkit";

export interface character {
    token: string;
    name: string;
}

export interface state {
    token: string;
    characters: character[];
};

const slice = createSlice({
    name: "master",
    initialState: {
        token: "",
        characters: []
    } as state,
    reducers: {
        
        updateCharacters (state, { payload }: { payload: character[] }) {

            state.characters = payload;

        },

        updateToken (state, { payload }: {payload: string}) {

            state.token = payload;

        }

    }
});

export default slice.reducer;
export const masterActions = slice.actions;