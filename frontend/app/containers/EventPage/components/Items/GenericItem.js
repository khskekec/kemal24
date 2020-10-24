import React, {useState} from 'react';

const GenericItem = ({icon, body, value, actions, footer, className, borderIndicatorColor, detailView}) => {
  const [isDetailedView, setDetailedView] = useState(false);

  return <li className={'list-group-item d-flex flex-column p-1 ' + className} style={{borderLeft: '0.5rem solid ' + (borderIndicatorColor ?? 'transparent')}} onClick={e => detailView ? setDetailedView(!isDetailedView) : null}>
    <div className='container-fluid'>
      <div className='row p-0'>
        &nbsp;
      </div>
      <div className='row align-items-center'>
        <div className='col-auto'>{icon}</div>
        <div className='col-6'>{body}</div>
        <div className='col-auto ml-auto font-weight-700 text-size-2'>{value}</div>
      </div>
      {footer}
    </div>
    {isDetailedView && <div className='col-12 mt-3 pt-2 shadow-lg'>{detailView}</div>}
  </li>
};

export default GenericItem;
