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

import { withStyles } from '@material-ui/core/styles';

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

export default function FormDialog({ onClose }) {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { register, handleSubmit } = useForm({
    mode: 'all',
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = async (data) => {
    // eslint-disable-next-line no-console
    try {
      setLoading(true);

      const content = await api({
        method: 'get',
        url: '/api/thin/password',
        params: data,
      });

      if (content) {
        await downloadBackupFile(content);
      }
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
        autoHideDuration: 3000,
      });
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const password = register('password', { required: true });

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle onClose={onClose}>输入密码</DialogTitle>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        {loading ? (
          <div className="center" style={{ marginBottom: 68 }}>
            <Spinner />
          </div>
        ) : (
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
        )}
      </Form>
    </Dialog>
  );
}

FormDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
};

const Form = styled.form`
  display: flex;
  height: 200px;
  width: 100%;
  justify-content: center;
  flex-direction: column;

  .form-submit {
    margin: 40px 24px 16px;
  }
`;
