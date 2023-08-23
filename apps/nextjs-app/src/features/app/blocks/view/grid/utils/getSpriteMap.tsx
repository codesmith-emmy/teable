import { renderToString } from 'react-dom/server';
import type { ISpriteMap, ISpriteProps } from '../../../grid/managers';

export const getSpriteMap = (
  iconItems: {
    type: string;
    IconComponent: React.JSXElementConstructor<{ style: React.CSSProperties }>;
  }[]
) => {
  const map: ISpriteMap = {};
  iconItems.forEach(({ type, IconComponent }) => {
    map[type] = (props: ISpriteProps) => {
      const { bgColor } = props;
      return renderToString(<IconComponent style={{ color: bgColor }} />);
    };
  });
  return map;
};