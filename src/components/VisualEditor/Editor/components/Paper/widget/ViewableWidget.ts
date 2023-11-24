import { primaryColor } from '@/settings/designSetting'

export const ViewableWidget = {
  name: 'ViewableWidget',
  props: [],
  events: [],
  render(moveable, React) {
    const rect = moveable.getRect()
    return React.createElement(
      'div',
      {
        key: 'ViewableWidget',
        className: 'moveable-ViewableWidget',
        style: {
          position: 'absolute',
          left: `${rect.width / 2}px`,
          top: `${rect.height + 20}px`,
          background: primaryColor,
          borderRadius: '2px',
          padding: '2px 4px',
          color: 'white',
          fontSize: '13px',
          whiteSpace: 'nowrap',
          fontWeight: 'bold',
          willChange: 'transform',
          transform: `translate(-50%, 0px)`,
        },
      },
      [
        '\n            ',
        Math.round(rect.offsetWidth),
        ' x ',
        Math.round(rect.offsetHeight),
        '\n        ',
      ],
    )
  },
}
