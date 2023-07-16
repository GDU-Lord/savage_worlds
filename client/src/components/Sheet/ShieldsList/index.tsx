import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions, RootState } from "../../../store/reducers";
import { Shield as ShieldClass } from "../../../store/slices/sheet/shields";
import Tab from "../Tab";
import Shield from "./Shield";
import s from "./index.module.sass";

export interface props {

};

export default function ArmorList (props: props) {

    const dispatch = useDispatch();
    const { saveData, addShields, updateDerivedStatistics } = bindActionCreators(actions, dispatch);

    const state = useSelector((state: RootState) => state.sheet);

    const list = state.shields.list.allIds.map((id, index) => {
        return (<Shield id={id} key={index}/>);
    });

    useEffect(() => {

        updateDerivedStatistics(state);

    });


    function add () {
        addShields([
            new ShieldClass({
                bonus: 2,
                cover: 2,
                price: 0,
                weight: 0,
                minStrength: 6,
                worn: true,
                hidden: false,
                name: ""
            })
        ]);
        saveData();
    }

    return (
        <div className={s.armor_list}>
            {(list.length > 0 || !state.sheet.locked) && <Tab name="shields" title="Щити">
                {list}
                {!state.sheet.locked && <button className={s.add} onClick={add} disabled={state.sheet.locked}>+</button>}
            </Tab>}
        </div>
    );

}