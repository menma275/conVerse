import { useState } from "react";

const GenerativeArt = ({ buttonLabel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <button onClick={toggleModal}>{buttonLabel}</button>
      {isOpen && (
        <>
          <div className="generativeart">
            <main></main>
            <footer>
              <p className="back-button">
                <button id="BacktoHome" onClick={toggleModal}>
                  Close
                </button>
              </p>
            </footer>
          </div>
        </>
      )}
    </>
  );
};
export default GenerativeArt;
