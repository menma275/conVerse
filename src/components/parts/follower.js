import React from "react";

const Follower = React.forwardRef(({ isVisible }, ref) => <div ref={ref} className="follower emoji-span" style={{ display: isVisible ? "" : "none" }}></div>);

Follower.displayName = "Follower";

export default Follower;
