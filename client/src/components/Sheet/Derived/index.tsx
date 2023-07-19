import { useSelector } from "react-redux";
import { RootState } from "../../../store/reducers";
import Tab from "../Tab";
import s from "./index.module.sass";
import { word } from "../../Language/language";

export interface props {

};

export default function Derived (props: props) {

    const state = useSelector((state: RootState) => state.sheet);

    const { parry, toughness, armor, weight, maxWeight, totalPoints, maxPoints } = state.derived;

    return (
        <div className={s.derived}>
            <Tab name="derived" title={word("derived_statistics")}>
                <div className={s.field}>
                    <div className={s.field_title}>{word("parry")}:</div>
                    <div className={s.field_content}>{parry}</div>
                </div>
                <div className={s.field}>
                    <div className={s.field_title}>{word("toughness")}:</div>
                    <div className={s.field_content}>{toughness}({armor})</div>
                </div>
                <div className={s.field}>    
                    <div className={s.field_title}>{word("load")}:</div>
                    <div className={s.field_content}>{weight}/{maxWeight}</div>
                </div>
                {state.sheet.locked ||
                    <div className={s.field}>    
                        <div className={s.field_title}>{word("upgrades")}:</div>
                        <div className={s.field_content}>{totalPoints}/{maxPoints}</div>
                    </div>
                }
            </Tab>
        </div>
    );

}