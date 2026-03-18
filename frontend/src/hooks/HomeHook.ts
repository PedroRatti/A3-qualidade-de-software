import { useEffect, useState } from "react";

type HomeResponse = {
    message: string;
};

export function homeHook() {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchHomeMessage = async () => {
            try {
                const response = await fetch("http://localhost:3000/", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status}`);
                }

                const data: HomeResponse = await response.json();
                setMessage(data.message);
            } catch {
                setError("Não foi possível conectar ao backend.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchHomeMessage();
    }, []);

    return {
        message,
        isLoading,
        error,
    };
}