import React, { createRef } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { create } from '@arcblock/ux/lib/Theme';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';

import CssBaseline from '@material-ui/core/CssBaseline';
import Icon from '@arcblock/ux/lib/Icon';
import IconButton from '@material-ui/core/IconButton';

import { LocaleProvider, useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import Layout from '@blocklet/launcher-layout';
import { StepProvider } from '@blocklet/launcher-layout/lib/context/step';
import { translations } from './locales';

import './app.css';
import Home from './pages/home';
import Password from './pages/password';

const theme = create({
  overrides: {
    MuiDialog: {
      paper: {
        margin: 0,
        width: 632,
        borderRadius: 16,
      },
      paperWidthSm: {
        maxWidth: 632,
      },
    },
    MuiButton: {
      root: {
        height: '48px',
        'border-radius': '60px !important',
        'font-size': '18px',
        'min-width': '48px',
        lineHeight: 1,
      },
      containedPrimary: {
        backgroundColor: '#4598FA',
        color: '#fff',

        '&:hover': {
          backgroundColor: '#0775F8',
        },
      },
      containedSecondary: {
        backgroundColor: '#49C3AD',
        color: '#fff',

        '&:hover': {
          backgroundColor: '#3AB39D',
        },
      },
      textPrimary: {
        border: '1px solid #4598FA',
        color: '#4598FA',
        backgroundColor: '#fff',

        '&:hover': {
          backgroundColor: '#EFF2FF',
        },
      },
      textSecondary: {
        backgroundColor: '#EAF4FF',
        color: '#4598FA',

        '&:hover': {
          backgroundColor: '#D3E7FE',
        },
      },
    },
    MuiIconButton: {
      root: {
        borderRadius: '100%',
      },
    },
  },
});

const GlobalStyle = createGlobalStyle`
  a {
    color: ${(props) => props.theme.colors.green};
    text-decoration: none;
  }

  ul, li {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const steps = [
  {
    key: 'upload',
    name: '上传文件',
    path: '/index',
  },
  {
    key: 'password',
    name: '输入密码',
    path: '/password',
  },
];

function App() {
  const { locale } = useLocaleContext();

  return (
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyle />

        <StepProvider steps={steps}>
          <Layout
            locale={locale}
            blockletMeta={{
              title: 'Clean Wallet',
              registryUrl: '/',
              did: 'z8iZxKtyeGLaXH4LkQ7Dxk7D86i1M1gQvfjVx',
            }}
            logoUrl="/logo.png"
            pcWidth="80%">
            <Content>
              <Switch>
                <Route exact path="/index" component={Home} />
                <Route path="/password" component={Password} />
                <Redirect to="/index" />
              </Switch>
            </Content>
          </Layout>
        </StepProvider>
      </ThemeProvider>
    </MuiThemeProvider>
  );
}

const WrappedApp = withRouter(App);

export default () => {
  // While the blocklet is deploy to a sub path, this will be work properly.
  const basename = window?.blocklet?.prefix || '/';
  const ref = createRef();

  const onClickDismiss = (key) => {
    ref.current?.closeSnackbar(key);
  };

  return (
    <Router basename={basename}>
      <SnackbarProvider
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        action={(key) => (
          <IconContainer
            onClick={() => {
              onClickDismiss(key);
            }}>
            <Icon name="times" size={20} color="#fff" />
          </IconContainer>
        )}>
        <LocaleProvider translations={translations}>
          <WrappedApp />
        </LocaleProvider>
      </SnackbarProvider>
    </Router>
  );
};

const IconContainer = styled(IconButton)`
  border-radius: 100%;
  width: 40px;
  height: 40px;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
