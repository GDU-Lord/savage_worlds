import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCharacter } from "../../character";
import { CopyObject, socket, SocketData } from "../../scripts";
import { actions, RootState } from "../../store/reducers";
import s from "./index.module.sass";

export interface props {
    children: JSX.Element;
};

let rendered = false;
let sheetState: RootState["sheet"];

export default function Socket ({ children }: props) {

    const dispatch = useDispatch();
    // const { saveData } = bindActionCreators(actions, dispatch);
    const state = sheetState = useSelector((state: RootState) => state.sheet);

    useEffect(() => {
        sheetState = state;
    }, [state]);

    if(!rendered) {
        socket.on("character-get", ({ status, data }: SocketData) => {
            if(status !== 200)
                return;
            updateCharacter(dispatch, sheetState, data);
        });
        rendered = true;
    }

    return children;

}