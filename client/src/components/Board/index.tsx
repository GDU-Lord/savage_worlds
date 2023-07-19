import { bindActionCreators } from "@reduxjs/toolkit";
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ObjectId } from "../../scripts";
import { actions, RootState } from "../../store/reducers";
import { Window } from "../../store/slices/master/board";
import s from "./index.module.sass";

export interface props {

};

export default function Board (props: props) {

    const state = useSelector((state: RootState) => state.master.board);

    const dispatch = useDispatch();
    const { moveWindow, setWindowFolded, closeWindow } = bindActionCreators(actions, dispatch);

    function load (e: any) {
        const iframe = e.target as HTMLIFrameElement;
        const int: any = setInterval(() => {
            if(iframe.parentNode?.parentNode == null)
                return clearInterval(int);
            const title = iframe.parentNode!.querySelector(`.${s.drag}`)!.querySelector(`.${s.title}`) as HTMLDivElement;
            title.innerText = iframe.contentDocument!.title;
        }, 100);
    }

    let offsetX = 0;
    let offsetY = 0;
    let curX = 0;
    let curY = 0;
    let dragId = "";
    let moved = false;
    let dragWin: Window | null;
    let dragDiv: HTMLDivElement | null;

    function move (e: MouseEvent) {
        if(dragDiv == null) return;
        curX = e.clientX - offsetX;
        curY = e.clientY - offsetY;
        dragDiv.style.left = curX + "px";
        dragDiv.style.top = curY + "px";
    }

    window.addEventListener("mousemove", e => {
        moved = true;
        move(e);
    });

    window.addEventListener("mouseup", e => {
        drop();
    });

    function foldUnfold (id: string) {
        if(moved) return;
        setWindowFolded({
            _id: id,
            folded: !state.windows.byId[id].folded
        });
    }

    function drag (e: React.MouseEvent<HTMLDivElement>, id: string, ref: React.RefObject<HTMLDivElement>) {
        dragDiv = ref.current!;
        dragWin = state.windows.byId[id];
        offsetX = e.clientX - dragWin.x;
        offsetY = e.clientY - dragWin.y;
        moved = false;
        dragId = id;
        dragDiv.querySelector("iframe")!.style.pointerEvents = "none";
        move(e as unknown as MouseEvent);
    }

    function drop () {
        if(dragDiv == null) return;
        dragDiv.querySelector("iframe")!.style.pointerEvents = "";
        if(!moved) foldUnfold(dragId);
        else moveWindow({
            _id: dragId,
            x: curX,
            y: curY
        });
        dragDiv =  dragWin = null;
        offsetX = offsetY = 0;
        dragId = "";
    }

    const list = state.windows.allIds.map(id => state.windows.byId[id]).map(win => {
        const style: React.CSSProperties = {
            position: "absolute",
            left: win.x + "px",
            top: win.y + "px"
        };
        const ref = React.createRef() as React.RefObject<HTMLDivElement>;
        return (
            <div className={s.component} key={win._id} ref={ref} style={style}>
                <div className={s.drag} onMouseDown={(e) => drag(e, win._id, ref)}>
                    <div className={s.title}>Test</div>
                    <button className={s.close} onClick={() => closeWindow(win._id)}>X</button>
                </div>
                <iframe src={win.url} onLoad={load} style={{ display: win.folded ? "none" : "block" }}/>
            </div>
        );
    });

    return (
        <div className={s.component}>{list}</div>
    );

}