import type React from 'react';
import { useState } from 'react';
import type { IMouseState, IPosition } from '../interface';

export const useSmartClick = (
  stageRef: React.RefObject<HTMLDivElement | undefined>,
  clickCallback: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
  dblClickCallback: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
) => {
  const [clickCount, setClickCount] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [startPos, setStartPos] = useState<IPosition | null>(null);
  const [dragging, setDragging] = useState(false);

  const onSmartMouseDown = (mouseState: IMouseState) => {
    const { x, y } = mouseState;
    setStartPos({ x, y });
  };

  const onSmartMouseUp = (mouseState: IMouseState) => {
    const { x, y } = mouseState;
    if (startPos && (Math.abs(startPos.x - x) > 5 || Math.abs(startPos.y - y) > 5)) {
      setDragging(true);
    }
  };

  const onSmartClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (dragging) {
      setDragging(false);
      return;
    }

    const rect = stageRef.current?.getBoundingClientRect();
    if (rect == null) return;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const now = Date.now();
    if (
      clickCount === 1 &&
      now - startTime < 300 &&
      startPos &&
      x === startPos.x &&
      y === startPos.y
    ) {
      clickCallback(event);
      dblClickCallback(event);
      setClickCount(0);
      setStartTime(0);
    } else {
      clickCallback(event);
      setClickCount(1);
      setStartTime(now);
    }
  };

  return { onSmartMouseDown, onSmartMouseUp, onSmartClick };
};