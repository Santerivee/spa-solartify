import "../../styles/Spinner.css";

export const Spinner = ({ text, percentage }: { text: string; percentage?: number }) => {
    return (
        <div id="spinner-container">
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
