import React, { createContext, useState } from "react";
import Routing from "./Routing";
export const AuthContext = createContext<any>("lol");

function App() {
    const [authObj, setAuthObj] = useState<any>();

    return (
        <AuthContext.Provider value={[authObj, setAuthObj]}>
            <Routing />
        </AuthContext.Provider>
    );
}

export default App;
