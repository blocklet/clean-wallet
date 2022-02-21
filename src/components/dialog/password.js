import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@arcblock/ux/lib/Button';

import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

import api from '../../libs/api';

export default function FormDialog({ onClose }) {
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
      await api({
        method: 'get',
        url: '/api/thin/password',
        params: data,
      });
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }
  };

  const password = register('password', { required: true });

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>输入密码</DialogTitle>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <TextField
            label="Password"
            fullWidth
            name="password"
            variant="outlined"
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
      </Form>
    </Dialog>
  );
}

FormDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
};

const Form = styled.form`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  flex-direction: column;

  .form-submit {
    margin: 40px 24px 16px;
  }
`;
