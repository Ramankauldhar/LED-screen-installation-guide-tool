import React, { useState } from 'react';
import { Stage, Layer, Rect, Text, Line } from 'react-konva';

const Drawing = ({ screenWidth, screenHeight, floorDistance, nicheWidth, nicheHeight }) => {
  const [stageWidth] = useState(800); // Canvas width
  const [stageHeight] = useState(1000); // Canvas height
  const scale = 10; // Scaling factor for dimensions

  return (
    <Stage width={stageWidth} height={stageHeight}>
      <Layer>
        {/* Draw Niche */}
        <Rect
          x={50}
          y={50}
          width={nicheWidth * scale}
          height={nicheHeight * scale}
          fill="#ddd"
          stroke="black"
          strokeWidth={2}
        />
        <Text
          x={50}
          y={30}
          text={`Niche Dimensions: ${nicheWidth}" x ${nicheHeight}"`}
          fontSize={14}
        />

        {/* Draw Screen */}
        <Rect
          x={60}
          y={60}
          width={screenWidth * scale}
          height={screenHeight * scale}
          fill="white"
          stroke="black"
          strokeWidth={2}
        />
        <Text
          x={60}
          y={60 + screenHeight * scale + 10}
          text={`Screen Dimensions: ${screenWidth}" x ${screenHeight}"`}
          fontSize={14}
        />

        {/* Floor Line */}
        <Line
          points={[0, floorDistance * scale, stageWidth, floorDistance * scale]}
          stroke="red"
          strokeWidth={1}
          dash={[10, 5]}
        />
        <Text
          x={10}
          y={floorDistance * scale - 20}
          text={`Floor Line: ${floorDistance}"`}
          fontSize={14}
          fill="red"
        />
      </Layer>
    </Stage>
  );
};

export default Drawing;
