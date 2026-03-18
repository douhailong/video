import React from 'react';

declare global {
  type ReactNode = React.ReactNode;
  type FC<P = {}> = React.FC<P>;
  type JSXElement = JSX.Element;
}
