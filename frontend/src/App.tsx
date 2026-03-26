import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./views/Login/Login.tsx";
import { Overview } from "./views/Overview/Overview.tsx";
import ServiceHealth from "./views/ServiceHealth/ServiceHealth.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/service-health" element={<ServiceHealth />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;