import { createSlice } from "@reduxjs/toolkit";
import { characterSave } from "../../../character";
import { lang, language } from "../../../words";

export interface state {
    locked: boolean;
    savedData: string;
    saved: boolean;
    language: language;
};

const slice = createSlice({
    name: "sheet",
    initialState: {
        locked: true,
        savedData: "",
        saved: true,
        language: lang.UA
    } as state,
    reducers: {
        setLocked (state, { payload: locked }: { payload: boolean }) {
            state.locked = locked;
        },
        saveData (state) {
            state.saved = false;
        },
        sendData (state, { payload }: { payload: any }) {
            if(state.saved)
                return;
            state.savedData = characterSave(payload);
            state.saved = true;
        },
        setLanguage (state, { payload }: {payload: language}) {
            state.language = payload;
        }
    }
});

export default slice.reducer;
export const sheetActions = slice.actions;