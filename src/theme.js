import { createTheme } from '@mui/material/styles'

// 디자인 토큰: references/cloud-drive/references.md 기반 + 무채색 변경(사용자 요청)
// 회색 단계·Pretendard·모서리·알약 버튼: Onflou
// 텍스트·메타·구분선: Box / 선택 틴트: Proton 패턴 / 아이브로 소제목: Onflou·pCloud
// 색상은 사용자 요청으로 전부 무채색(검정·회색)으로 바꾸고, 오류·성공 색만 남겼다.
const fontFamily =
  '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Malgun Gothic", sans-serif'

// 포인트 단계: 50~100은 선택 틴트, 500은 메인(검정), 700~900은 강조 텍스트
const accent = {
  50: '#F2F2F2',
  100: '#E6E6E6',
  200: '#CCCCCC',
  300: '#4D4D4D',
  400: '#333333',
  500: '#1A1A1A',
  600: '#0D0D0D',
  700: '#333333',
  800: '#1F1F1F',
  900: '#111111',
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

const ink = '#161616'
const line = '#E3E3E3'
const motion = 'cubic-bezier(0.2, 0, 0, 1)'

const theme = createTheme({
  palette: {
    primary: { main: accent[500], light: accent[300], dark: accent[600], contrastText: '#FFFFFF' },
    secondary: { main: gray[500], light: gray[400], dark: gray[700], contrastText: '#FFFFFF' },
    error: { main: '#FF6568', contrastText: '#FFFFFF' },
    success: { main: '#388E3C' },
    accent,
    grey: gray,
    background: { default: gray[50], paper: '#FFFFFF' },
    text: { primary: ink, secondary: gray[600], disabled: gray[400] },
    meta: gray[500],
    divider: line,
    action: { hover: gray[100], selected: accent[50] },
    // 파일 종류 색: 무채색 단계로 통일하고 아이콘 모양으로 구분한다
    fileType: {
      folder: gray[800],
      doc: gray[700],
      sheet: gray[700],
      slide: gray[700],
      pdf: gray[700],
      image: gray[600],
      video: gray[600],
      audio: gray[600],
      zip: gray[800], // 중요 표시(별) 색으로도 쓰인다
      other: gray[500],
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
    '0 1px 2px rgba(0, 0, 0, 0.06)',
    '0 4px 16px rgba(0, 0, 0, 0.08)',
    ...Array(22).fill('0 12px 32px rgba(0, 0, 0, 0.12)'),
  ],
  transitions: {
    easing: { easeOut: motion },
  },
  // 포인트 그라디언트: 검정 → 짙은 회색, 배경 크기를 200%로 두고 호버 시 위치를 옮긴다
  gradient: {
    point: `linear-gradient(120deg, ${gray[900]} 0%, ${gray[600]} 50%, ${gray[900]} 100%)`,
    overlay: 'linear-gradient(120deg, rgba(17, 17, 17, 0.9) 0%, rgba(102, 102, 102, 0.9) 100%)',
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
          '&:hover': { backgroundColor: accent[400] },
          '&:active': { backgroundColor: accent[600] },
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
          '&.Mui-selected': { backgroundColor: '#FFFFFF', color: ink, boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' },
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
