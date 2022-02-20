/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import styled from 'styled-components';

import Button from '@arcblock/ux/lib/Button';

import { useDropzone } from 'react-dropzone';

import api from '../libs/api';

export default function SetupRecover() {
  const onDrop = async (files) => {
    const formData = new FormData();
    formData.append('file', files[0]);

    const res = await api({
      method: 'post',
      url: '/api/thin/upload',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log(res);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.abt',
    multiple: false,
  });

  const onRecoverWithMnemonic = () => {};

  return (
    <Container>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
      </div>

      <RecoverButton variant="text" color="secondary" rounded onClick={onRecoverWithMnemonic}>
        上传
      </RecoverButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .upload {
    width: 100%;
    height: 218px;
    border: 1px dashed #4598fa;
    box-sizing: border-box;
    border-radius: 12px;
    margin-top: 48px;
    color: #4598fa;
    flex-direction: column;
    cursor: pointer;

    .upload-text {
      font-size: 16px;
      line-height: 19px;
      text-align: center;
      margin: 20px 34px 0;
    }
  }

  .active {
    border: 1px solid #4598fa;
  }

  .or {
    font-size: 16px;
    line-height: 19px;
    color: #999999;
    margin: 40px 0;
  }
`;

const RecoverButton = styled(Button)`
  width: 100%;
`;
