"use client";
const GenerativeArt = (props) => {
  return (
    <>
      {props.isOpen && (
        <>
          <div className="generativeart">
            <iframe src="/SamuelYAN/index.html" frameBorder="0"></iframe>
            <footer>
              <p className="back-button">
                <button id="BacktoHome" onClick={() => props.toggleModal()}>
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
