import { Route, Routes } from "react-router-dom";
import Socket from "./components/Socket";
import CharacterPage from "./routes/CharacterPage";
import CharacterTokenPage from "./routes/CharacterTokenPage";
import HomePage from "./routes/HomePage";
import MasterPage from "./routes/MasterPage";
import MasterTokenPage from "./routes/MasterTokenPage";
import Language from "./components/Language/language";
import SummaryPage from "./routes/SummaryPage";

function App() {
    
    return (
        <div className="App">
            {/* <Sheet/> */}
            <Socket>
                <Language>
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/master/token" element={<MasterTokenPage/>}/>
                        <Route path="/master" element={<MasterPage/>}/>
                        <Route path="/character/token" element={<CharacterTokenPage/>}/>
                        <Route path="/character" element={<CharacterPage/>}/>
                        <Route path="/summary" element={<SummaryPage/>}/>
                    </Routes>
                </Language>
            </Socket>
        </div>
    );

}

export default App;

// exp, wounds, fatigue, bennies
// name, race, 
// inc