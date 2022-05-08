import "../../styles/Spinner.css";

export const Spinner = ({ text }: { text: string }) => {
    return (
        <div id="spinner-container">
            <p id="spinner-text">{text}</p>

            <div id="spinner">
                <p title="this text is not moving" id="spinner-percentage">
                    0%
                </p>
            </div>
        </div>
    );
};
export default Spinner;
