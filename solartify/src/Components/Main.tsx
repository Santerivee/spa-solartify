import Player from "./Main/Player";
import Spinner from "./Main/Spinner";
import { AuthContext } from "../App";
import { useEffect, useContext, useState } from "react";

const Main = () => {
    //@ts-ignore
    const [authObj, setAuthObj] = useContext(AuthContext);
    const [params, setParams] = useState<any>();

    useEffect(() => {
        setParams(Object.fromEntries(new URLSearchParams(window.location.hash.substring(1)).entries()));
        // params = {accessToken: string, expiresIn: number, tokenType: string (Bearer)}
        setAuthObj(params);

        return () => {};
    }, []);

    // return true ? <Player data={["1"]} /> : <Spinner text={"getting something"} />;
    return <></>;
};
export default Main;
