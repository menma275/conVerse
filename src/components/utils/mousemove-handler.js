import { isCursorDevice } from "@/components/utils/utils";

const OPACITY_VISIBLE = 0.5;
const OPACITY_HIDDEN = 0;

export const handleMouseMove = (e, isAddingCard, followerRef, containerRef, zoom) => {
  if (followerRef.current) {
    if (!isAddingCard || !isCursorDevice()) {
      followerRef.current.style.opacity = OPACITY_HIDDEN;
      return;
    }
    const containerRect = containerRef.current.getBoundingClientRect();
    const newX = (e.clientX - containerRect.left) / zoom;
    const newY = (e.clientY - containerRect.top) / zoom;

    followerRef.current.style.opacity = OPACITY_VISIBLE;
    followerRef.current.style.left = newX + "px";
    followerRef.current.style.top = newY + "px";
  }
};
