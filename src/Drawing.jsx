import React from 'react';
import { Stage, Layer, Rect, Text, Line, Arrow } from 'react-konva';

const Drawing = ({ screenWidth, screenHeight, floorDistance, nicheWidth, nicheHeight }) => {
  const stageWidth=1000;
  const stageHeight=1120;

  // Calculate the center and dimensions dynamically
  const isVertical = screenHeight > screenWidth;
  const screenStartX = isVertical ? 60 : 40;
  const screenStartY = isVertical ? 40 : 60;

  // Determine scaling factor based on screenWidth
  const scale = isVertical
  ? (screenHeight > 400 ? 1 : screenHeight > 110 ? 5 : screenHeight > 70 ? 6 : 8)
  : (screenWidth > 400 ? 1 : screenWidth > 110 ? 5 : screenWidth > 70 ? 6 : 8);

  // Calculate the center of the screen relative to the canvas
  const centerX = screenStartX + (screenWidth * scale) / 2; // Center X of the screen
  const centerY = screenStartY + (screenHeight * scale) / 2; // Center Y of the screen

  // Calculate niche positions based on orientation
  const nicheX = screenStartX - ((nicheWidth * scale) - screenWidth * scale) / 2;
  const nicheY = screenStartY - ((nicheHeight * scale) - screenHeight * scale) / 2;

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
        {nicheWidth && nicheHeight ? (
          <>
            <Rect
               x={nicheX}
               y={nicheY}
               width={nicheWidth * scale}
               height={nicheHeight * scale}
               fill="white"
               stroke="grey"
               strokeWidth={2}
            />
            <Text
              x={nicheX}
              y={nicheY-20}
              text={`Niche Dimensions: ${nicheWidth}" x ${nicheHeight}"`}
              fontSize={14}
            />
          </>
        ) : null}

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
          y={screenStartY + screenHeight * scale + 20}
          text={`Screen Dimensions: ${screenWidth}" x ${screenHeight}"`}
          fontSize={14}
        />

        {/* Floor Line */}
        <Line
          points={[5, floorDistance * scale, stageWidth-400, floorDistance * scale]}
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
          y={outletBoxY-45}
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
        
        {/* Arrow for Niche Dimentions */}
        <Arrow
          points={[16, nicheY, 16, nicheHeight * scale]} // Niche Dimension Arrow
          stroke="black"
          fill="black"
          strokeWidth={1}
          pointerLength={10}
          pointerWidth={10}
          pointerAtBeginning={true}
        />  
        {/* Arrow for Screen Dimentions */}
        <Arrow
          points={[nicheWidth+20, screenStartY, centerX, screenStartY + screenHeight * scale]} // Screen Dimension Arrow
          stroke="black"
          fill="black"
          strokeWidth={1}
          pointerLength={10}
          pointerWidth={10}
          pointerAtBeginning={true}
        />

        {/* Black Dashed Arrow from Center of Screen to Floor */}
        <Arrow
          points={[5, centerY, 5, floorDistance * scale]}
          stroke="black"
          fill="black"
          strokeWidth={1}
          pointerLength={10}
          pointerWidth={10}
          pointerAtBeginning={true}
        />
        {/* Length Measurement */}
        <Text
          x={8}
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