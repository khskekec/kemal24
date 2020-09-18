import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

const ImageUploader = ({onChange}) => {
  const [store, setStore] = useState([]);
  const fileInput = useRef();

  const add = e => {
    const files = e.currentTarget.files;
    const fr = new FileReader();

    let file = null;
    for (let i = 0 ; i < files.length ; i++) {
      file = files[i];

      fr.onload = () => {
        const newStore = [...store, {
          title: file.name,
          type: file.type,
          content: fr.result
        }];

        setStore(newStore);
        onChange(newStore);

        fileInput.current.value = '';
      }

      fr.readAsDataURL(file);
    }
  }

  const remove = i => {
    const newStore = [...store];
    newStore.splice(i, 1)
    setStore(newStore);
    onChange(newStore);
  }

  return <div className='row'>
    <div className='col-12'>
      <div>
        <input type='file' onChange={add} ref={fileInput} className='d-none' accept="image/*"/>
        <button className='btn btn-primary btn-block' onClick={() => fileInput.current.click()}>Upload Image or take a photo</button>
      </div>
      <br />
      { store.length > 0 ? store.map((e,i) => <div  key={i} className='col row shadow-lg bg-gradient m-2'>
        <div className='col-auto px-0'>
          <img src={e.content} width={100} height={100} />
        </div>
        <div className='col align-self-center text-truncate'>
          <span className='text-truncate'>{e.title}</span><br/>
          <span className='badge bg-info'>{e.type}</span>
        </div>
        <div className='col align-self-center text-right'>
          <button className='btn btn-danger' onClick={() => remove(i)}><i className='fa fa-trash' /></button>
        </div>
      </div>) : <div className='alert alert-info'>Please upload some images</div>}
    </div>
  </div>
}

ImageUploader.propTypes = {
  onChange: PropTypes.func.isRequired
};

ImageUploader.defaultProps = {
  onChange: () => null
}

export default ImageUploader;
