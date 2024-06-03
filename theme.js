import { DefaultTheme as PaperDefaultTheme } from 'react-native-paper';

export const MyTheme = {
  ...PaperDefaultTheme,
  version: 3,
  colors: {
    ...PaperDefaultTheme.colors,
    primary: '#B2B1CF',
    accent: '#fdf2b0',
    background: '#FFFFFF',
    text: '#000000',
    card: '#FFFFFF',
    border: '#CCCCCC',
    notification: '#F50057',
    tabBarActiveTintColor: 'purple',
    tabBarInactiveTintColor: '#000807',
    activeColor: "#B2B1CF",
  },
  elevation: {
    level0: 0,
    level1: 1,
    level2: 2,
    level3: 3,
    level4: 4,
    level5: 5,
  },
};
