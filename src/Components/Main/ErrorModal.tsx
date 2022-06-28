import React, { useEffect } from "react";

export const ErrorModal = ({ error, setError }: { error: string | Error; setError: any }) => {
    useEffect(() => {
        console.log(error);

        return () => {};
    }, [error]);

    return (
        <div onClick={() => setError("")} id="error-modal">
            Error: {error.toString()}
        </div>
    );
};
