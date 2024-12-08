import React, { useState } from 'react';
import { Stage, Layer, Rect, Text, Line, Arrow } from 'react-konva';

const Drawing = ({ screenWidth, screenHeight, floorDistance, nicheWidth, nicheHeight }) => {
  const [stageWidth] = useState(800); // Canvas width
  const [stageHeight] = useState(800); // Canvas height
  const scale = 10; // Scaling factor for dimensions

  // Calculate the center of the screen relative to the canvas
  const screenStartX = 60; // Starting X position of the screen
  const screenStartY = 60; // Starting Y position of the screen
  const centerX = screenStartX + (screenWidth * scale) / 2; // Center X of the screen
  const centerY = screenStartY + (screenHeight * scale) / 2; // Center Y of the screen

   // Dimensions and position for the power outlet box
   const outletBoxWidth = 5 * scale; // Width of the power outlet box
   const outletBoxHeight = 2.5 * scale; // Height of the power outlet box
   const outletBoxX = centerX - outletBoxWidth / 2; // Centered horizontally
   const outletBoxY = screenStartY + screenHeight * scale - outletBoxHeight - 10; // Near the bottom of the screen

  // Bottom of the screen
  const screenBottomY = screenStartY + screenHeight * scale;

  return (
    <Stage width={stageWidth} height={stageHeight}>
      <Layer>
        {/* Draw Niche */}
        <Rect
          x={50}
          y={50}
          width={nicheWidth * scale}
          height={nicheHeight * scale}
          fill="white"
          stroke="grey"
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
          x={screenStartX}
          y={screenStartY}
          width={screenWidth * scale}
          height={screenHeight * scale}
          fill="white"
          stroke="black"
          strokeWidth={4}
        />
        <Text
          x={screenStartX}
          y={screenStartY + screenHeight * scale + 7}
          text={`Screen Dimensions: ${screenWidth}" x ${screenHeight}"`}
          fontSize={14}
        />

        {/* Floor Line */}
        <Line
          points={[40, floorDistance * scale, stageWidth-300, floorDistance * scale]}
          stroke="black"
          strokeWidth={1}
        />
        <Text
          x={40}
          y={floorDistance * scale +10}
          text={`Floor Line`}
          fontSize={14}
          fill="black"
        />

         {/* Center Lines */}
        {/* Vertical Center Line */}
        <Line
          points={[centerX, screenStartY, centerX, screenStartY + screenHeight * scale]}
          stroke="blue"
          strokeWidth={1}
          dash={[5, 5]}
        />
        {/* Horizontal Center Line */}
        <Line
          points={[screenStartX, centerY, screenStartX + screenWidth * scale, centerY]}
          stroke="blue"
          strokeWidth={1}
          dash={[5, 5]}
        />
        {/* Center Label */}
        <Text
          x={centerX + 5}
          y={centerY - 20}
          text="Screen Position"
          fontSize={14}
          fill="blue"
        />
        {/* Power Outlet Box */}
        <Rect
          x={outletBoxX}
          y={outletBoxY}
          width={outletBoxWidth}
          height={outletBoxHeight}
          stroke="green"
          strokeWidth={2}
          dash={[10, 5]}
        />
        <Text
          x={outletBoxX}
          y={outletBoxY - 20}
          text="Receptable Box"
          fontSize={14}
          fill="green"
        />

        {/* Black Dashed Arrow from Center of Screen to Floor */}
        <Arrow
          points={[40, centerY, 40, floorDistance * scale]}
          stroke="black"
          fill="black"
          strokeWidth={1}
          pointerLength={10}
          pointerWidth={10}
          pointerAtBeginning={true}
        />
        {/* Length Measurement */}
        <Text
          x={centerX + 10}
          y={(screenBottomY + floorDistance * scale) / 2 - 10} // Position text at the middle of the arrow
          text={`Floor Distance: ${floorDistance}"`}
          fontSize={14}
          fill="black"
        />
      </Layer>
    </Stage>
  );
};

export default Drawing;
