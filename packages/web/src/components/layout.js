import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { LocaleContext } from '@arcblock/ux/lib/Locale/context';
import LocaleSelector from '@arcblock/ux/lib/Locale/selector';
import BaseLayout from '@arcblock/ux/lib/Layout';

function Layout({ children, ...rest }) {
  const { t } = useContext(LocaleContext);
  const env = window.env || {};

  return (
    <StyledLayout
      className="layout"
      variant="border"
      title={env.appName || t('common.title')}
      brand={env.appName || t('common.title')}
      description=""
      addons={<LocaleSelector className="locale-selector" showText={false} />}
      showLogo
      links={[]}
      {...rest}>
      <>{children}</>
    </StyledLayout>
  );
}

Layout.propTypes = {
  children: PropTypes.any,
};

Layout.defaultProps = {
  children: null,
};

const StyledLayout = styled(BaseLayout)`
  display: flex;

  .locale-selector {
    margin-left: 12px;
    font-size: 16px;
    .trigger {
      .trigger-image {
        width: 21px;
        height: 21px;
      }
      .trigger-text {
        font-size: 16px;
      }
    }
  }

  .footer {
    margin-top: 0;
  }
`;

export default Layout;
