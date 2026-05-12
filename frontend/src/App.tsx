import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./views/Login/Login.tsx";
import { ProtectedRoute } from "./utils/ProtectedRoute.tsx";
import { Ponto } from "./views/Ponto/Ponto.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route
                    path="/overview"
                    element={
                        <ProtectedRoute>
                            <Ponto />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;