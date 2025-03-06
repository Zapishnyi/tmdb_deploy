import stringToColor from './MUI_StringTo Color';

export default function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 100,
      height: 100,
    },
    children: `${name?.split(' ')[0][0]}${name?.split(' ')[1] ? name?.split(' ')[1][0] : ''}`,
  };
}
