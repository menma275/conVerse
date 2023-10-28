import { useState, useEffect } from "react";

export const useCardAnimation = (index, postId, dataPostId, setPostId, setIsOpacity, isInitialLoad, setIsInitialLoad) => {
  const [isBouncing, setIsBouncing] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(false);

  useEffect(() => {
    if (postId == dataPostId) {
      console.log("postId", postId);
      setIsBouncing(true);
      setPostId(false);
    }
  }, [postId]);

  useEffect(() => {
    if (isBouncing) triggerBouncingEffect();
    if (isInitialRender) triggerInitialRenderEffect();
  }, [isBouncing, isInitialRender]);

  useEffect(() => {
    const delay = !isInitialLoad ? 0 : 50 * index;
    const timer = setTimeout(() => {
      setIsInitialRender(true);
      setIsOpacity(false);
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  const triggerBouncingEffect = () => {
    setIsInitialRender(true);
    const timer = setTimeout(() => {
      setIsBouncing(false);
      setIsInitialRender(false);
    }, 1000);
    return () => clearTimeout(timer);
  };

  const triggerInitialRenderEffect = () => {
    const timer = setTimeout(() => {
      setIsInitialRender(false);
      setIsInitialLoad(false);
    }, 1000);
    return () => clearTimeout(timer);
  };

  return { isBouncing, isInitialRender, setIsBouncing };
};
