/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useMemo } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import PwdDialog from '@src/components/dialog/password';

export default function SetupRecover() {
  const l = useLocation();
  const history = useHistory();

  const urlParams = new URLSearchParams(l.search);

  const keyPair = useMemo(() => {
    return {
      nonce: urlParams.get('nonce'),
      publicKey: urlParams.get('publicKey'),
      secretKey: urlParams.get('secretKey'),
    };
  }, []);

  return (
    <PwdDialog
      keyPair={keyPair}
      onClose={() => {
        history.push('/index');
      }}
    />
  );
}
