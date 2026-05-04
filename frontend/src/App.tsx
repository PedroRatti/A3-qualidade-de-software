import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./views/Login/Login.tsx";
import { Overview } from "./views/Overview/Overview.tsx";
import { ProtectedRoute } from "./utils/ProtectedRoute.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route
                    path="/overview"
                    element={
                        <ProtectedRoute>
                            <Overview />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;