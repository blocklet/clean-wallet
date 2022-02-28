/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { useDropzone } from 'react-dropzone';
import { useSnackbar } from 'notistack';
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';

import Typography from '@material-ui/core/Typography';
import BackupIcon from '@material-ui/icons/Backup';

import api from '../libs/api';

export default function SetupRecover() {
  const { t } = useLocaleContext();
  const history = useHistory();

  const { enqueueSnackbar } = useSnackbar();

  const onDrop = async (files) => {
    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const res = await api({
        method: 'post',
        url: '/api/clean/upload',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const urlParams = new URLSearchParams(res);
      history.push({
        pathname: '/password',
        search: urlParams.toString(),
      });
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
        autoHideDuration: 3000,
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.abt',
    multiple: false,
  });

  return (
    <Container component="div">
      <Typography className={`center upload ${isDragActive ? 'active' : ''}`} component="div" {...getRootProps()}>
        <BackupIcon style={{ fontSize: 56 }} />
        <Typography className="upload-text">{t('common.upload')}</Typography>
        <input {...getInputProps()} data-cy="setup-upload-file" />
      </Typography>
    </Container>
  );
}

const Container = styled(Typography)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;

  .upload {
    width: 400px;
    height: 218px;
    border: 1px dashed #4598fa;
    box-sizing: border-box;
    border-radius: 12px;
    color: #4598fa;
    flex-direction: column;
    cursor: pointer;

    .upload-text {
      font-size: 16px;
      line-height: 19px;
      text-align: center;
      margin: 20px 34px 0;
      color: #4598fa;
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
