import { createTheme } from '@mui/material/styles'

// 디자인 토큰: references/cloud-drive/references.md 기반
// 틸 포인트·회색 단계·Pretendard·모서리·알약 버튼: Onflou
// 텍스트·메타·구분선: Box / 선택 틴트: Proton 패턴 / 아이브로 소제목: Onflou·pCloud
const fontFamily =
  '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Malgun Gothic", sans-serif'

const teal = {
  50: '#E6FBFA',
  100: '#CCF7F5',
  200: '#99EFEB',
  300: '#66E7E1',
  400: '#33DFD7',
  500: '#00CFC5',
  600: '#00B8AF',
  700: '#009E97',
  800: '#00847F',
  900: '#005A57',
}

const gray = {
  50: '#FAFAFA',
  100: '#F5F5F5',
  200: '#EAEAEA',
  300: '#D6D6D6',
  400: '#B5B5B5',
  500: '#8A8A8A',
  600: '#666666',
  700: '#444444',
  800: '#222222',
  900: '#111111',
}

const ink = '#151F26'
const line = '#DDE6ED'
const motion = 'cubic-bezier(0.2, 0, 0, 1)'

const theme = createTheme({
  palette: {
    primary: { main: teal[500], light: teal[300], dark: teal[700], contrastText: gray[900] },
    secondary: { main: '#3F6DFF', light: '#7399FF', dark: '#2448C7', contrastText: '#FFFFFF' },
    error: { main: '#FF6568', contrastText: '#FFFFFF' },
    success: { main: '#388E3C' },
    teal,
    grey: gray,
    background: { default: gray[50], paper: '#FFFFFF' },
    text: { primary: ink, secondary: gray[600], disabled: gray[400] },
    meta: '#8EA6B2',
    divider: line,
    action: { hover: gray[100], selected: teal[50] },
    // 파일 종류 색: 레퍼런스 팔레트에서 가져온 값 (괄호 안이 출처)
    fileType: {
      folder: teal[600], // Onflou primary-600
      doc: '#3F6DFF', // Onflou secondary
      sheet: '#388E3C', // Onflou success
      slide: '#FA551E', // Dropbox accent
      pdf: '#FF6568', // Onflou error
      image: '#6D4AFF', // Proton primary
      video: '#C937E4', // Box accent
      audio: '#1DBAF6', // Box accent
      zip: '#E1AD4A', // Box accent
      other: gray[500], // Onflou gray-500
    },
  },
  typography: {
    fontFamily,
    h1: { fontSize: 'clamp(1.625rem, 3vw, 2.125rem)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.25 },
    h2: { fontSize: '1.125rem', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.4 },
    h3: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.4 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 600 },
    body1: { fontSize: '0.9375rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.55 },
    caption: { fontSize: '0.75rem', lineHeight: 1.5 },
    overline: { fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.14em', lineHeight: 1.6 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0 },
    statNumber: { fontSize: 'clamp(1.5rem, 2.4vw, 1.875rem)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2 },
  },
  shape: { borderRadius: 12 },
  spacing: 8,
  shadows: [
    'none',
    '0 1px 2px rgba(21, 31, 38, 0.06)',
    '0 4px 16px rgba(21, 31, 38, 0.08)',
    ...Array(22).fill('0 12px 32px rgba(21, 31, 38, 0.12)'),
  ],
  transitions: {
    easing: { easeOut: motion },
  },
  // 포인트 그라디언트: Onflou 틸(700) → Onflou 세컨더리 블루, Tresorit 블루 그라디언트 띠 응용
  gradient: {
    // 배경 크기를 200%로 두고 위치를 옮기면 호버 시 색이 흐르듯 이동한다
    point: `linear-gradient(120deg, ${teal[700]} 0%, #3F6DFF 50%, ${teal[700]} 100%)`,
    overlay: 'linear-gradient(120deg, rgba(0, 158, 151, 0.9) 0%, rgba(63, 109, 255, 0.9) 100%)',
  },
  motion: { hover: `transform 350ms ${motion}, border-color 350ms ${motion}, background-color 350ms ${motion}` },
  layout: { sidebarWidth: 264, detailWidth: 320 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 18, minHeight: 40 },
        outlined: {
          borderColor: gray[300],
          color: ink,
          backgroundColor: '#FFFFFF',
          '&:hover': { borderColor: gray[400], backgroundColor: gray[100] },
          '&:active': { backgroundColor: gray[200] },
        },
        containedPrimary: {
          '&:hover': { backgroundColor: teal[400] },
          '&:active': { backgroundColor: teal[600] },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 500 },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: 0,
          borderRadius: 999,
          color: gray[500],
          '&.Mui-selected': { backgroundColor: '#FFFFFF', color: ink, boxShadow: '0 1px 2px rgba(21, 31, 38, 0.1)' },
          '&.Mui-selected:hover': { backgroundColor: '#FFFFFF' },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: { backgroundColor: gray[100], borderRadius: 999, padding: 3, gap: 2 },
        grouped: { border: 0, borderRadius: '999px !important', margin: 0 },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 6, borderRadius: 999, backgroundColor: gray[200] },
        bar: { borderRadius: 999 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: { borderColor: line },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { backgroundColor: gray[900], fontSize: '0.75rem', borderRadius: 8 },
      },
    },
  },
})

export default theme
