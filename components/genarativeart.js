const GenerativeArt = ({ isOpen, toggleModal }) => {
  console.log(isOpen);
  return (
    <>
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
