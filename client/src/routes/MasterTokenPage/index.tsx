import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Page, { block } from "../../components/Page";
import { SERVER_URL } from "../../config";
import { actions, RootState } from "../../store/reducers";
import { word } from "../../components/Language/language";

export interface props {

};

export interface campaign {
    token: string;
    characters: {
        name: string;
        token: string;
    }[];
};

export default function MasterTokenPage (props: props) {

    const nav = useNavigate();
    const state = useSelector((state: RootState) => state.master);
    const dispatch = useDispatch();

    const { updateCharacters, updateToken } = bindActionCreators(actions, dispatch);

    const blocks: block[] = [
        {
            texts: [word("provide_your_token")],
            inputs: ["token"],
            buttons: [
                {
                    text: word("confirm"),
                    async callback (inputs) {
                        const token = inputs[0].value;
                        const res = await fetch(SERVER_URL + "/campaign/get?master_token=" + token);
                        if(res.status !== 200) return;
                        const campaign = await res.json() as campaign;
                        updateToken(campaign.token);
                        updateCharacters(campaign.characters);
                        nav("/master");
                    }
                },
                {
                    text: word("back"),
                    callback () {
                        nav("/");
                    }
                }
            ]
        }
    ];

    return (
        <Page blocks={blocks}/>
    );

}