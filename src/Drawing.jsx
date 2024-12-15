import React from 'react';
import { Stage, Layer, Rect, Text, Line, Arrow } from 'react-konva';

const Drawing = ({ screenWidth, screenHeight, floorDistance, nicheWidth, nicheHeight }) => {
  const stageWidth=1000;
  const stageHeight=880;

  // Calculate the center and dimensions dynamically
  const isVertical = screenHeight > screenWidth;
  const screenStartX = isVertical ? 80 : 70;
  const screenStartY = isVertical ? 70 : 80;

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

  //ineer dashed box
  const innerBoxHeight = screenHeight * scale - 40;
  const innerBoxTopEdgeY = centerY + innerBoxHeight / 2;

   // Dimensions and position for the power outlet box
   const outletBoxWidth = 5 * scale; // Width of the power outlet box
   const outletBoxHeight = 2.5 * scale; // Height of the power outlet box
   const outletBoxX = centerX - outletBoxWidth / 2; // Centered horizontally
   const outletBoxY = innerBoxTopEdgeY - outletBoxHeight - 5; // Near the bottom of the screen

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

            {/* Arrow for Niche Height */}
            <Arrow
              points={[
                nicheX - 15, nicheY,                               
                nicheX - 15, nicheY + nicheHeight * scale        
              ]}
               stroke="grey"
               fill="lightgrey"
               strokeWidth={1}
               pointerLength={10}
               pointerWidth={10}
               pointerAtBeginning={true}
               pointerAtEnding={true}
            />  
            <Line
              points={[nicheX - 20, nicheY, nicheX - 10, nicheY]} // Top notch
              stroke="grey"
              strokeWidth={1}
            />
            <Line
              points={[
                nicheX - 20,
                nicheY + nicheHeight * scale,
                nicheX - 10,
                nicheY + nicheHeight * scale,
              ]} // Bottom notch
              stroke="grey"
              strokeWidth={1}
            />
            {/* Rect for Niche Height Text*/}
            <Rect
               x={nicheX - 55 }
               y={nicheY + (nicheHeight * scale) / 2 - 18 - 5}
               width={30 + 5 * 2}
               height={10 + 5 * 2}
               fill="#f2f2f2"
               stroke="grey"
               strokeWidth={1}
          />
            <Text
               x={nicheX - 52}
               y={nicheY + (nicheHeight * scale) / 2 - 18}
               text={`${nicheHeight}"`}
               fontSize={12}
               fill="grey"
            />

            {/* Arrow for Niche Width */}
            <Arrow
               points={[
                  nicheX, nicheY + nicheHeight * scale + 20,
                  nicheX + nicheWidth * scale, nicheY + nicheHeight * scale + 20 
               ]}
               stroke="grey"
               fill="lightgrey"
               strokeWidth={1}
               pointerLength={10}
               pointerWidth={10}
               pointerAtBeginning={true}
               pointerAtEnding={true}
            />
            <Line
              points={[
                nicheX,
                nicheY + nicheHeight * scale + 15,
                nicheX,
                nicheY + nicheHeight * scale + 25,
              ]} // Left notch
              stroke="grey"
              strokeWidth={1}
            />
            <Line
              points={[
                nicheX + nicheWidth * scale,
                nicheY + nicheHeight * scale + 15,
                nicheX + nicheWidth * scale,
                nicheY + nicheHeight * scale + 25,
              ]} // Right notch
              stroke="grey"
              strokeWidth={1}
            />
            {/* Rect for Niche Width Text*/}
            <Rect
               x={nicheX + (nicheWidth * scale) / 2 - 20 - 5} 
               y={nicheY + nicheHeight * scale + 25 - 5} 
               width={40 + 5 * 2}
               height={12 + 5 * 2}
               fill="#f2f2f2" 
               stroke="grey" 
               strokeWidth={1} 
            />
            <Text
               x={nicheX + (nicheWidth * scale) / 2 - 20} 
               y={nicheY + nicheHeight * scale + 25} 
               text={`${nicheWidth}"`}
               fontSize={12}
               fill="grey"
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
        {/* Rect for Screen Height Text*/}
        <Rect
           x={screenStartX + screenWidth * scale + 32 - 5} 
           y={screenStartY + (screenHeight * scale) / 2 - 18 - 5} 
           width={32 + 5 * 2} 
           height={10 + 5 * 2}
           fill="#f2f2f2"
           stroke="grey" 
           strokeWidth={1} 
        />
        <Text
          x={screenStartX + screenWidth * scale + 32}
          y={screenStartY + (screenHeight * scale) / 2 - 18}
          text={`${screenHeight}"`}
          fontSize={12}
          fill="grey"
        />
        {/* Arrow for Screen Height */}
        <Arrow
          points={[
            screenStartX + screenWidth * scale + 28, screenStartY,  
            screenStartX + screenWidth * scale + 28, screenStartY + screenHeight * scale, 
          ]}
          stroke="grey"
          fill="lightgrey"
          strokeWidth={1}
          pointerLength={10}
          pointerWidth={10}
          pointerAtBeginning={true}
          pointerAtEnding={true}
        />  
        <Line
          points={[
            screenStartX + screenWidth * scale + 23,
            screenStartY,
            screenStartX + screenWidth * scale + 33,
            screenStartY,
          ]} // Top notch
          stroke="grey"
          strokeWidth={1}
        />
        <Line
          points={[
            screenStartX + screenWidth * scale + 23,
            screenStartY + screenHeight * scale,
            screenStartX + screenWidth * scale + 33,
            screenStartY + screenHeight * scale,
          ]} // Bottom notch
          stroke="grey"
          strokeWidth={1}
        />
        {/* Arrow for Screen Width */}
        <Arrow
           points={[
            screenStartX, screenStartY - 28, 
            screenStartX + screenWidth * scale, screenStartY - 28
           ]}
           stroke="grey"
           fill="lightgrey"
           strokeWidth={1}
           pointerLength={10}
           pointerWidth={10}
           pointerAtBeginning={true}
           pointerAtEnding={true}
        />
        <Line
          points={[
            screenStartX,
            screenStartY - 33,
            screenStartX,
            screenStartY - 23,
          ]} // Left notch
          stroke="grey"
          strokeWidth={1}
        />
        <Line
          points={[
            screenStartX + screenWidth * scale,
            screenStartY - 33,
            screenStartX + screenWidth * scale,
            screenStartY - 23,
          ]} // Right notch
          stroke="grey"
          strokeWidth={1}
        />
        {/* Rect for Screen Width text */}
        <Rect
          x={screenStartX + (screenWidth * scale) / 2 - 30}
          y={screenStartY - 50} 
          width={60}
          height={20}
          fill="#f2f2f2"
          stroke="grey"
          strokeWidth={1}
        />
        <Text
          x={screenStartX + (screenWidth * scale) / 2 - 20}
          y={screenStartY - 44}
          text={`${screenWidth}"`}
          fontSize={12}
          fill="grey"
        />


        {/* Intended Screen Position Line */}
        <Text
          x={centerX + 60}
          y={screenStartY - 70}
          text="Intended Screen Position"
          fontSize={12}
          fill="grey"
        />
        <Arrow
          points={[centerX + 60, screenStartY - 60, centerX, centerY]}
          stroke="lightgrey"
          fill="lightgrey"
          pointerLength={10}
          pointerWidth={10}
        />

        {/* Floor Line */}
        <Line
          points={[5, floorDistance * scale, stageWidth-400, floorDistance * scale]}
          stroke="grey"
          strokeWidth={1}
        />
        <Text
          x={10}
          y={floorDistance * scale - 20}
          text={`Floor Line`}
          fontSize={12}
          fill="grey"
        />

        {/* Black Arrow from Center of Screen to Floor */}
        <Arrow
          points={[5, centerY, 5, floorDistance * scale]}
          stroke="grey"
          fill="lightgrey"
          strokeWidth={1}
          pointerLength={10}
          pointerWidth={10}
          pointerAtBeginning={true}
        />
        <Text
          x={8}
          y={stageHeight / 2 - 10}
          text={`${floorDistance}"`}
          fontSize={12}
          fill="grey"
        />
        <Text
          x={8}
          y={stageHeight / 2 + 10}
          text={`FD`}
          fontSize={12}
          fill="grey"
        />

         {/* Center Lines */}
        {/* Vertical Center Line */}
        <Line
          points={[centerX, screenStartY, centerX, screenStartY + screenHeight * scale]}
          stroke="black"
          strokeWidth={1}
          dash={[5, 5]}
        />
        {/* Horizontal Center Line */}
        <Line
          points={[screenStartX, centerY, screenStartX + screenWidth * scale, centerY]}
          stroke="black"
          strokeWidth={1}
          dash={[5, 5]}
        />

        {/* Power Outlet Box */}
        <Rect
          x={outletBoxX}
          y={outletBoxY}
          width={outletBoxWidth}
          height={outletBoxHeight}
          stroke="grey"
          strokeWidth={2}
          dash={[2, 2]}
        />
        <Rect
          x={outletBoxX+5}
          y={outletBoxY+5}
          width={outletBoxWidth-10}
          height={outletBoxHeight-10}
          stroke="grey"
          strokeWidth={2}
          dash={[2, 2]}
        />
         <Text
          x={centerX + 120}
          y={screenStartY - 50}
          text="Install Recessed Receptable Box"
          fontSize={12}
          fill="grey"
        />
        <Line
          points={[
            centerX + 120,
            screenStartY - 40,
            outletBoxX + outletBoxWidth / 2,
            outletBoxY+ 10 ,
          ]}
          stroke="lightgrey"
          fill="lightgrey"
        />

        {/* Inner Dashed Box */}
        <Rect
          x={screenStartX + 20}  
          y={screenStartY + 20}  
          width={screenWidth * scale - 40}  
          height={screenHeight * scale - 40}  
          stroke="grey"
          strokeWidth={1}
          dash={[10, 5]}  
        />
      </Layer>
    </Stage>
  );
};

export default Drawing;