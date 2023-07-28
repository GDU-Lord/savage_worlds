import { createSlice } from "@reduxjs/toolkit";
import { CopyObject, ObjectId } from "../../../scripts";

export interface note {
    id?: string;
    name: string;
    notes: string;
    hidden: boolean;
}

export class Note implements note {

    static counter: number = 0;

    id: string;
    name: string;
    notes: string;
    hidden: boolean;

    constructor (tool: note, persist_id: boolean = false) {

        this.name = tool.name;
        this.notes = tool.notes;
        this.hidden = tool.hidden ?? true;

        const newId = ObjectId();
        this.id = persist_id ? tool.id ?? newId : newId;

    }
    
}

export interface state {
    list: {
        byId: {
            [key: string]: note;
        };
        allIds: string[];
    };
};

const slice = createSlice({
    name: "hindtances",
    initialState: {
        list: {
            byId: {},
            allIds: []
        }
    } as state,
    reducers: {
        addNotes (state, { payload: list }: {payload: Note[]}) {
            for(const tool of list) {
                state.list.allIds.push(tool.id);
                state.list.byId[tool.id] = tool;
            }
        },
        updateNote (state, { payload: hindrance }: { payload: Note }) {
            state.list.byId[hindrance.id] = hindrance;
        },
        deleteNote (state, { payload: id }: { payload: string }) {
            const index = state.list.allIds.findIndex(val => val === id);
            if(index >= 0) {
                state.list.allIds.splice(index, 1);
                delete state.list.byId[id];
            }
        },
        initNotes (state, { payload } : {payload: state}) {
            payload = CopyObject(payload);
            for(const id in payload.list.byId) {
                payload.list.byId[id].hidden = payload.list.byId[id].hidden ?? true;
            }
            return payload;
        },
        toggleHiddenNote (state, { payload: id } : { payload: string }) {
            const note = new Note(state.list.byId[id], true);
            note.hidden = !note.hidden;
            state.list.byId[id] = note;
        }
    }
});

export default slice.reducer;
export const notesActions = slice.actions;