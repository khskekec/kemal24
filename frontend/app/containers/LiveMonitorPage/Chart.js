import React from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ReferenceLine,
  ReferenceArea
} from 'recharts';
import moment from 'moment';

const Chart = ({events, xValue, yValue}) => {
  return <ResponsiveContainer width='100%' height="100%" className='px-0'>
    <ComposedChart data={events} syncId="anyId"
                   padding={{left: 0, right: 0}}
                   margin={{
                     top: 0, right: 0, left: 0, bottom: 0,
                   }}>
      <CartesianGrid vertical={false} horizontal={true} />
      <XAxis
        dataKey={xValue}
        domain={[50, 'auto']}
        orientation='bottom'
        mirror
        axisLine={false}
        tickFormatter={e => moment(e).local().format('DD.MM HH:mm')}
        reversed
        tickSize={0}
        tickLine={false}
        padding={{right: 20, left:20}}
      />
      <YAxis
        dataKey={yValue}
        ticks={[50,100,150, 200, 250, 300]}
        tickMargin={5}
        mirror
        axisLine={false}
        orientation='right'
        tickLine={false}
      />
      <Tooltip content={'asd'} formatter={(value, name, props) => ([value, null])}
               itemStyle={{textAlign: 'center', fontWeight: 'bold'}}
               labelFormatter={e => moment(e).local().format('DD.MM HH:mm:ss')}
               coordinate={{ x: 100, y: 140 }} offset={100}
     />
      <ReferenceLine y={200} stroke="red" strokeWidth={0.5}/>
      <ReferenceLine y={100} stroke="green" strokeWidth={0.5}/>
      <ReferenceLine y={70} stroke="red" strokeWidth={0.5}/>
      <Line type="monotone" dataKey={yValue} dot={false} stroke="black" strokeWidth={3}/>
      {/*<Line type="monotone" dataKey='bolus' stroke="#8884d8"/>*/}
      {/*<Line type="monotone" dataKey='correction' stroke="#8884d8"/>*/}
      <ReferenceArea x1={150} x2={180} y1={200} y2={300} stroke="red" strokeOpacity={0.3}/>
      <ReferenceArea x1={150} x2={180} y1={200} y2={300} stroke="red" strokeOpacity={0.3}/>
    </ComposedChart>
  </ResponsiveContainer>;
};

Chart.defaultProps = {
  xValue: 'start',
  yValue: 'value'
}

export default Chart;
