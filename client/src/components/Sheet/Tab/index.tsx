import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { actions, RootState } from "../../../store/reducers";
import { state as tabsState } from "../../../store/slices/sheet/tabs"; 
import s from "./index.module.sass";

export interface props {
    children: React.ReactNode[];
    name: keyof tabsState;
    title: string;
}

export default function Tab ({ children, name, title }: props) {

    const dispatch = useDispatch();
    const { updateTab } = bindActionCreators(actions, dispatch);

    const state = useSelector((state: RootState) => state.sheet);

    function update () {
        updateTab({
            name,
            value: !state.tabs[name]
        })
    }

    const visible = state.tabs[name];

    return (<div className={s.tab}>
        <div onClick={update} className={s.title}>{title}</div>
        {visible && children}
    </div>);

}