import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./views/Login/Login.tsx";
import { Overview } from "./views/Overview/Overview.tsx";
import ServiceHealth from "./views/ServiceHealth/ServiceHealth.tsx";
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
<Route
path="/service-health"
element={
<ProtectedRoute>
<ServiceHealth />
</ProtectedRoute>
}
/>
</Routes>
</BrowserRouter>
);
}

export default App;