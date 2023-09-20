const Zoom = (Props) => {
  const zoomin = (e) => {
    Props.setZoom((prevCount) => prevCount + 0.2);
  };
  const zoomout = (e) => {
    if (Props.zoom > 0.4) {
      Props.setZoom((prevCount) => prevCount - 0.2);
    }
  };

  return (
    <>
      <div id="manipulate">
        <button id="zoomin" className="pixel-shadow" onClick={zoomin}>
          +
        </button>
        <button id="zoomout" className="pixel-shadow" onClick={zoomout}>
          -
        </button>
      </div>
    </>
  );
};
export default Zoom;
