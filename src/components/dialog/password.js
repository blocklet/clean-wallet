/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Button from '@arcblock/ux/lib/Button';
import Spinner from '@arcblock/ux/lib/Spinner';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import Table from '@src/components/table/clean';
import nacl from 'tweetnacl';

import { withStyles } from '@material-ui/core/styles';
import { toUint8Array, toBase58, fromBase58 } from '@ocap/util';

import api from '../../libs/api';
import { downloadBackupFile } from '../../libs/util';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

export default function FormDialog({ keyPair, onClose }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const { register, handleSubmit } = useForm({
    mode: 'all',
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = async (res) => {
    try {
      setLoading(true);

      const encryptPwd = nacl.box(
        toUint8Array(res.password),
        toUint8Array(fromBase58(keyPair.nonce)),
        toUint8Array(fromBase58(keyPair.publicKey)),
        toUint8Array(fromBase58(keyPair.secretKey))
      );
      const base64EncryptPwd = toBase58(encryptPwd);

      const content = await api({
        method: 'get',
        url: '/api/clean/password',
        params: {
          password: base64EncryptPwd,
        },
      });

      setData(content);
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
        autoHideDuration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const onDownload = async () => {
    if (data.backup) {
      await downloadBackupFile(data.backup);
    }

    onClose();
  };

  console.log(data);

  const password = register('password', { required: true });

  const RenderContent = () => {
    if (data) {
      return (
        <>
          <DialogContent>
            <div className="center">
              <Table {...data} />
            </div>
          </DialogContent>

          <Button
            type="submit"
            onClick={onDownload}
            color="primary"
            rounded
            variant="contained"
            className="form-submit">
            下载
          </Button>
        </>
      );
    }

    if (loading) {
      return (
        <div className="center" style={{ marginBottom: 68 }}>
          <Spinner />
        </div>
      );
    }

    return (
      <>
        <DialogContent>
          <TextField
            label="Password"
            fullWidth
            name="password"
            variant="outlined"
            type="password"
            onChange={password.onChange}
            onBlur={password.onBlur}
            inputRef={password.ref}
          />
        </DialogContent>

        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          color="primary"
          rounded
          variant="contained"
          className="form-submit">
          确认
        </Button>
      </>
    );
  };

  const RenderTitle = () => {
    if (data) {
      return <>下载备份</>;
    }

    return <>输入密码</>;
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle onClose={onClose}>
        <RenderTitle />
      </DialogTitle>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <RenderContent />
      </Form>
    </Dialog>
  );
}

FormDialog.propTypes = {
  keyPair: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

const Form = styled.form`
  display: flex;
  min-height: 200px;
  width: 100%;
  justify-content: center;
  flex-direction: column;

  .form-submit {
    margin: 40px 24px 16px;
  }
`;
