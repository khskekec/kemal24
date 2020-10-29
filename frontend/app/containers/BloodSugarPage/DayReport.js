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

  console.log(min, max);
  for (var i = min; i < max + 10; i = i + 10) {
    const d = new Array(25).fill('');
    d[0] = i;

    for (var j = 0; j < data.length; j++) {
      if (data[j].avg >= i && data[j].avg <= i + 10) {
        d[parseInt(data[j].point) + 1] = data[j].avg;
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

  return <div className='container-fluid'>
    <div className='row'>
      <div className='col-12'>
        <div className='card shadow-lg m-2'>
          <div className='card-header'>
            <h3>{moment(start).format('DD.MM.YYYY')}</h3>
          </div>
          <table className='table table-bordered'>
            <thead>
            <tr className='text-center'>
              <th></th>
              <th>00</th>
              <th>01</th>
              <th>02</th>
              <th>03</th>
              <th>04</th>
              <th>05</th>
              <th>06</th>
              <th>07</th>
              <th>08</th>
              <th>09</th>
              <th>10</th>
              <th>11</th>
              <th>12</th>
              <th>13</th>
              <th>14</th>
              <th>15</th>
              <th>16</th>
              <th>17</th>
              <th>18</th>
              <th>19</th>
              <th>20</th>
              <th>21</th>
              <th>22</th>
              <th>23</th>
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
}

export default DayReport;
