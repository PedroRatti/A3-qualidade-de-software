import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { Login } from "./views/Login/Login.tsx";
import { ProtectedRoute } from "./utils/ProtectedRoute.tsx";
import { Ponto } from "./views/Ponto/Ponto.tsx";
import { Requests } from "./views/Requests/Requests.tsx";
import { Collaborators } from "./views/Collaborators/Collaborators.tsx";

function App() {
    return (
        <BrowserRouter>
            <NotificationsProvider>
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
                    <Route
                        path="/requests"
                        element={
                            <ProtectedRoute>
                                <Requests />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/collaborators"
                        element={
                            <ProtectedRoute requireAdmin>
                                <Collaborators />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </NotificationsProvider>
        </BrowserRouter>
    );
}

export default App;