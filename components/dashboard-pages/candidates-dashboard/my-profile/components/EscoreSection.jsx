'use client';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';

// Dynamic import with SSR disabled
const ReactSpeedometer = dynamic(() => import('react-d3-speedometer'), { ssr: false });

const EscoreSection = ({ score_og, label_og })  => {

  const [score, setScore] = useState(score_og ?? 650); // Default score 650
  const [label, setLabel] = useState(label_og ?? "Eisil Score");

  return (
    <>

          <div 
  className="card-body d-flex justify-content-center align-items-center flex-column"
>
  <ReactSpeedometer
    value={score}
    minValue={300}
    maxValue={900}
    segments={4}
    segmentColors={['#ff4e42', '#ffa726', '#9acd32', '#008000']} 
    customSegmentLabels={[
      { text: 'POOR', position: 'INSIDE', color: '#fff', fontSize: '10px' },
      { text: 'AVERAGE', position: 'INSIDE', color: '#fff', fontSize: '10px' },
      { text: 'GOOD', position: 'INSIDE', color: '#fff', fontSize: '10px' },
      { text: 'EXCELLENT', position: 'INSIDE', color: '#fff', fontSize: '10px' },
    ]}
    needleColor="#000"
    needleHeightRatio={0.65} 
    ringWidth={30}  
    textColor="transparent"  
    valueTextFontSize="0px"  
    height={180} 
    width={300}  
  />

  {/* Custom Score Display */}
  <div className="mt-2 text-center">
    <h5 style={{ fontWeight: 'bold' }}>{label}: {score}</h5>
  </div>
</div>




    </>
  );
};
/* 
 <ReactSpeedometer
          value={score}
          minValue={0}
          maxValue={100}
          segments={5}
          needleColor="steelblue"
          startColor="red"
          endColor="green"
          textColor="#000"
          height={200}
          width={300}
        />
         */

export default EscoreSection;
