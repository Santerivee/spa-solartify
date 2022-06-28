import "../../styles/Spinner.css";
import { ErrorModal } from "./ErrorModal";

export const Spinner = ({ text, percentage, error, setError }: { text: string; percentage?: number; error?: Error | string | null; setError?: any }) => {
    return (
        <div id="spinner-container">
            {error ? <ErrorModal error={error} setError={setError} /> : null}
            <p id="spinner-text">{text}</p>
            <div id="spinner">
                <p title="this text is not moving" id="spinner-percentage">
                    {percentage ? percentage : 0}%
                </p>
            </div>
        </div>
    );
};
export default Spinner;
