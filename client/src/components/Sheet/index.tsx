import ArmorList from "./ArmorList";
import Attributes from "./Attributes";
import Derived from "./Derived";
import OtherStats from "./OtherStats";
import Skills from "./Skills";
import ToolsList from "./ToolsList";
import WeaponList from "./WeaponsList";
import s from "./index.module.sass";
import EdgesList from "./EdgesList";
import HindrancesList from "./HindrancesList";
import TextStats from "./TextStats";
import { useDispatch, useSelector } from "react-redux";
import { actions, RootState } from "../../store/reducers";
import { characterSave } from "../../character";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect } from "react";
import ShieldsList from "./ShieldsList";
import { word } from "../Language/language";

export interface props {

};

export default function Sheet (props: props) {

    const state = useSelector((state: RootState) => state.sheet);

    const dispatch = useDispatch();
    const { sendData} = bindActionCreators(actions, dispatch);

    useEffect(() => {
        sendData(state);
    }, [state]);

    document.head.querySelector("title")!.innerText = state.text.name.trim() === "" ? word("character") : state.text.name;

    return (
        <div className={s.sheet}>
            <TextStats/>
            <Derived/>
            <EdgesList/>
            <HindrancesList/>
            <OtherStats/>
            <ArmorList/>
            <ShieldsList/>
            <WeaponList/>
            <ToolsList/>
            <Attributes/>
            <Skills/>
        </div>
    );

}