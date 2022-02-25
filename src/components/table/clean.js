import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
});

export default function cleanTable({ apps, accounts }) {
  const classes = useStyles();
  const rows = [
    {
      before: apps.before,
      after: apps.after,
      ratio: parseInt((((apps.before || 0) - (apps.after || 0)) / apps.before) * 100, 10),
      clean: (apps.before || 0) - (apps.after || 0),
      name: 'APP',
    },
    {
      before: accounts.before,
      after: accounts.after,
      ratio: parseInt((((accounts.before || 0) - (accounts.after || 0)) / accounts.before) * 100, 10),
      clean: (accounts.before || 0) - (accounts.after || 0),
      name: 'ACCOUNT',
    },
  ];

  return (
    <TableContainer>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '150px' }} />
            <TableCell align="center">瘦身钱</TableCell>
            <TableCell align="center">瘦身后</TableCell>
            <TableCell align="center">瘦身比例</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell align="center">{row.name}</TableCell>
              <TableCell align="center">{row.before}</TableCell>
              <TableCell align="center">{row.after}</TableCell>
              <TableCell align="center">{`- ${row.ratio} %`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Tips>{`Tips: Clean up ${rows[0].clean} of apps information and ${rows[1].clean} accounts information`}</Tips>
    </TableContainer>
  );
}

cleanTable.propTypes = {
  apps: PropTypes.object.isRequired,
  accounts: PropTypes.object.isRequired,
};

const Tips = styled.div`
  font-size: 14px;
  color: red;
`;
