import React, {useEffect, useState} from 'react';
import axios from "../../../utils/axios";
import {HeatMap} from "@nivo/heatmap";
import {getBloodSugarRange, round} from "../../../utils/misc";
import BaseTable, {
  AutoResizer,
  Column
} from "react-base-table";
const DailyHourlyAvgHeatmap = ({data}) => {
  const transformed = {};

  if (!data) return null;

  data.forEach(e => {
    const date = e.point.split(' ')[0];
    const hour = e.point.split(' ')[1].split(':')[0];

    const data = {
      ...(transformed[date] ? transformed[date] : {}),
      index: date,
      [hour]: e.avg.toFixed(0),
      [hour + 'color']: '#FACEFA',
    }

    transformed[date] = data;
  });
  const commonProperties = {
    margin: {top: 60, right: 80, bottom: 60, left: 80},
    data: data,
    indexBy: 'index',
    keys: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
  }

  return <AutoResizer>
    {({width, height}) => <HeatMap {...commonProperties} data={Object.values(transformed)}
                                   padding={2}
                                   enableGridX={true}
                                   cellShape={CustomCell}
                                   enableGridY={true}
                                   width={width}
                                   height={height}
    />}
  </AutoResizer>
};

const CustomCell = ({
                      data,
                      value,
                      x,
                      y,
                      width,
                      height,
                      color,
                      opacity,
                      borderWidth,
                      borderColor,
                      enableLabel,
                      textColor,
                      onHover,
                      onLeave,
                      onClick,
                      theme,
                    }) => {
  if (!value) return null;

  const alertColor = getBloodSugarRange(value).color;
  return (
    <g
      transform={`translate(${x}, ${y})`}
      onMouseEnter={onHover}
      onMouseMove={onHover}
      onMouseLeave={onLeave}
      onClick={e => onClick(data, e)}
      style={{cursor: 'pointer'}}
    >
      <rect x={width/2*-1} y={height/2*-1} width={width} height={height}
            fill={alertColor} fill-opacity="0.85" stroke-width="0" stroke="rgb(84,48,5)" stroke-opacity="0.85"></rect>
      {enableLabel && (
        <text
          alignmentBaseline="central"
          textAnchor="middle"
          style={{
            ...theme.labels.text,
            fill: 'white',
            fontSize: '30px'
          }}
          fillOpacity={opacity}
        >
          {value}
        </text>
      )}
    </g>
  );
}


export default DailyHourlyAvgHeatmap;
