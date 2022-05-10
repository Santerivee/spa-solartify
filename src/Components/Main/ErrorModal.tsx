import React, { useEffect } from "react";

export const ErrorModal = ({ error }: { error: string | Error }) => {
    useEffect(() => {
        console.log(error);

        return () => {};
    }, [error]);

    return <div id="error-modal">Error: {error.toString()}</div>;
};
