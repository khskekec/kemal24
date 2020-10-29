import React, {
  useState,
  useEffect
} from 'react';
import axios from "../../utils/axios";
import moment from 'moment';
const DayReport = ({start, end}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => setData((await axios.get('/bloodsugar/hourly-avg', {params: {start, end}})).data);

  const sorted = data.sort((e, i) => e.avg - i.avg);
  const min = sorted.length ? parseInt(parseInt(sorted[0].avg).toString().substr(0, parseInt(sorted[0].avg).toString().length - 1) + 0) : 0;
  const max = sorted.length ? parseInt(parseInt(sorted.reverse()[0].avg).toString().substr(0, parseInt(sorted.reverse()[0].avg).toString().length - 1) + 0) : 0;

  const matrix = [];

  for (var i = min; i < max + 10; i = i + 10) {
    const d = new Array(25).fill('');
    d[0] = i;

    for (var j = 0; j < data.length; j++) {
      if (data[j].avg >= i && data[j].avg <= i + 10) {
        d[parseInt(data[j].point) + 1] = Math.round(data[j].avg);
      }
    }

    matrix.push(d);
  }

  const correctionMatrix = (new Array(25).fill(''));
  correctionMatrix[0] = 'Correction';

  data.forEach(e => {
    correctionMatrix[parseInt(e.point) + 1] = e['correction']
  });

  const bolusMatrix = (new Array(25).fill(''));
  bolusMatrix[0] = 'Bolus';

  data.forEach(e => {
    bolusMatrix[parseInt(e.point) + 1] = e['bolus']
  });

  return <div className='card shadow-lg m-2 table-responsive day-report'>
    <div className='card-header'>
      <h3>{moment(start).format('DD.MM.YYYY')}</h3>
    </div>
    <div className='card-body table-responsive p-0'>
      <table className='table table-bordered'>
        <thead>
        <tr className='text-center table-dark'>
          <th scope='col'></th>
          <th scope='col'>00</th>
          <th scope='col'>01</th>
          <th scope='col'>02</th>
          <th scope='col'>03</th>
          <th scope='col'>04</th>
          <th scope='col'>05</th>
          <th scope='col'>06</th>
          <th scope='col'>07</th>
          <th scope='col'>08</th>
          <th scope='col'>09</th>
          <th scope='col'>10</th>
          <th scope='col'>11</th>
          <th scope='col'>12</th>
          <th scope='col'>13</th>
          <th scope='col'>14</th>
          <th scope='col'>15</th>
          <th scope='col'>16</th>
          <th scope='col'>17</th>
          <th scope='col'>18</th>
          <th scope='col'>19</th>
          <th scope='col'>20</th>
          <th scope='col'>21</th>
          <th scope='col'>22</th>
          <th scope='col'>23</th>
        </tr>
        </thead>
        <tbody className='text-center'>
        {
          matrix.reverse().map(e => <tr>
            {e.map(f => <td>{f}</td>)}
          </tr>)
        }
        </tbody>
        <tfoot className='text-center'>
        <tr className='table-info'>
          {bolusMatrix.map(e => <td>{e}</td>)}
        </tr>
        <tr className='table-warning'>
          {correctionMatrix.map(e => <td>{e}</td>)}
        </tr>
        </tfoot>
      </table>
    </div>
  </div>;
  return <div className='container-fluid day-report' >
    <div className='row'>
      <div className='col-12'>
        <div className='card shadow-lg m-2 table-responsive'>
          <div className='card-header'>
            <h3>{moment(start).format('DD.MM.YYYY')}</h3>
          </div>
          <div className='card-body table-responsive'>
            <table className='table table-bordered'>
              <thead>
              <tr className='text-center'>
                <th scope='col'></th>
                <th scope='col'>00</th>
                <th scope='col'>01</th>
                <th scope='col'>02</th>
                <th scope='col'>03</th>
                <th scope='col'>04</th>
                <th scope='col'>05</th>
                <th scope='col'>06</th>
                <th scope='col'>07</th>
                <th scope='col'>08</th>
                <th scope='col'>09</th>
                <th scope='col'>10</th>
                <th scope='col'>11</th>
                <th scope='col'>12</th>
                <th scope='col'>13</th>
                <th scope='col'>14</th>
                <th scope='col'>15</th>
                <th scope='col'>16</th>
                <th scope='col'>17</th>
                <th scope='col'>18</th>
                <th scope='col'>19</th>
                <th scope='col'>20</th>
                <th scope='col'>21</th>
                <th scope='col'>22</th>
                <th scope='col'>23</th>
              </tr>
              </thead>
              <tbody className='text-center'>
              {
                matrix.reverse().map(e => <tr>
                  {e.map(f => <td>{f}</td>)}
                </tr>)
              }
              </tbody>
              <tfoot className='text-center'>
              <tr>
                {bolusMatrix.map(e => <td>{e}</td>)}
              </tr>
              <tr>
                {correctionMatrix.map(e => <td>{e}</td>)}
              </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default DayReport;
