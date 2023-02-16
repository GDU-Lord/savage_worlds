import { createSlice } from "@reduxjs/toolkit";
import { ObjectId } from "../../../scripts";

export interface window {
    _id: string;
    url: string;
    x: number;
    y: number;
    folded: boolean;
}

export interface state {
    windows: {
        byId: {
            [key: string]: window;
        };
        allIds: string[]
    }
};

export class Window implements window {

    _id: string;
    url: string;
    x: number;
    y: number;
    folded: boolean;

    constructor (url: string, x: number = 0, y: number = 0, id: string = ObjectId(), folded: boolean = false) {
        this._id = id;
        this.url = url;
        this.x = x;
        this.y = y;
        this.folded = folded;
    }

}

const slice = createSlice({
    name: "board",
    initialState: {
        windows: {
            allIds: [],
            byId: {}
        }
    } as state,
    reducers: {
        
        loadWindows (state, { payload: windows }: { payload: state["windows"] }) {
            
        },

        addWindow (state, { payload: url }: { payload: string }) {
            const win = new Window(url);
            state.windows.allIds.push(win._id);
            state.windows.byId[win._id] = win;
        },

        closeWindow (state, { payload: id }: { payload: string }) {
            const index = state.windows.allIds.indexOf(id);
            state.windows.allIds.splice(index, 1);
            delete state.windows.byId[id];
        },

        moveWindow (state, { payload: { _id, x, y } }: { payload: { _id: string, x: number, y: number } }) {
            const win = state.windows.byId[_id];
            state.windows.byId[_id] = new Window(win.url, x, y, _id, win.folded);
        },

        setWindowFolded (state, { payload: { _id, folded } }: { payload: { _id: string, folded: boolean } }) {
            const win = state.windows.byId[_id];
            state.windows.byId[_id] = new Window(win.url, win.x, win.y, _id, folded );
        }

    }
});

export default slice.reducer;
export const boardActions = slice.actions;