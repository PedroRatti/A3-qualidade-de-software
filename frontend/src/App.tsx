import { homeHook } from "./hooks/HomeHook";

function App() {
    const { message, isLoading, error } = homeHook();

    return (
        <main className="container">
            <div className="card">
                <h1>EquipeHub</h1>

                {isLoading && <p>Carregando...</p>}
                {!isLoading && error && <p>{error}</p>}
                {!isLoading && !error && <p>{message}</p>}
            </div>
        </main>
    );
}

export default App;