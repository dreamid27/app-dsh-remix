import { Box, BoxProps, StackProps } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const calculateHeight = () => {
  const heightScreen = window.innerHeight;
  const headerEl = document.getElementsByClassName('header-app');
  const navEl = document.getElementsByClassName('navigation-app');
  const heightHeader =
    (headerEl && headerEl[0] && headerEl[0].clientHeight) || 0;
  const heightNav = (navEl && navEl[0] && navEl[0].clientHeight) || 0;

  return heightScreen - heightHeader - heightNav;
};

interface FullHeightProps extends BoxProps, StackProps {
  as?: React.ElementType;
  children?: React.ReactNode;
}

const FullHeight: React.FC<FullHeightProps> = ({ children, ...restProps }) => {
  const [windowSize, setWindowSize] = useState('100vh');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize(`${calculateHeight()}px`);
    }

    const handleResize = () => {
      const height = calculateHeight();
      setWindowSize(`${height}px`);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Box
      style={{
        minHeight: windowSize,
        height: 'max-content',
      }}
      {...restProps}
    >
      {children}
    </Box>
  );
};

FullHeight.propTypes = {
  children: PropTypes.node,
};

export default FullHeight;
