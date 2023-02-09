import { createSlice } from "@reduxjs/toolkit";
import { characterSave } from "../../../character";
import { RootState } from "../../reducers";

export interface state {
    locked: boolean;
    savedData: string;
    saved: boolean;
};

const slice = createSlice({
    name: "sheet",
    initialState: {
        locked: true,
        savedData: "",
        saved: true
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
        }
    }
});

export default slice.reducer;
export const sheetActions = slice.actions;