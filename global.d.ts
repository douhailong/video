import React from 'react';

declare global {
  type ReactNode = React.ReactNode;
  type ChildrenProps = React.PropsWithChildren;
  type FC<P = {}> = React.FC<P>;
  type JSXElement = JSX.Element;
}
