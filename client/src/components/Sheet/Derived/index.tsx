import { useSelector } from "react-redux";
import { RootState } from "../../../store/reducers";
import Tab from "../Tab";
import s from "./index.module.sass";

export interface props {

};

export default function Derived (props: props) {

    const state = useSelector((state: RootState) => state.sheet);

    const { parry, toughness, armor, weight, maxWeight, totalPoints, maxPoints } = state.derived;

    return (
        <div className={s.derived}>
            <Tab name="derived" title="Похідна статистика">
                <div className={s.field}>
                    <div className={s.field_title}>Захист:</div>
                    <div className={s.field_content}>{parry}</div>
                </div>
                <div className={s.field}>
                    <div className={s.field_title}>Стійкість:</div>
                    <div className={s.field_content}>{toughness}({armor})</div>
                </div>
                <div className={s.field}>    
                    <div className={s.field_title}>Навантаження:</div>
                    <div className={s.field_content}>{weight}/{maxWeight}</div>
                </div>
                {state.sheet.locked ||
                    <div className={s.field}>    
                        <div className={s.field_title}>Прокачка:</div>
                        <div className={s.field_content}>{totalPoints}/{maxPoints}</div>
                    </div>
                }
            </Tab>
        </div>
    );

}