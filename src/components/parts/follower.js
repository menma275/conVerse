import React from "react";

const Follower = React.forwardRef(({ isVisible, message }, ref) => (
  <div ref={ref} className="follower emoji-span" style={{ display: isVisible ? "" : "none" }}>
    {message}
  </div>
));

Follower.displayName = "Follower";

export default Follower;
