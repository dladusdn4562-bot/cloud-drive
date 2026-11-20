import FolderRoundedIcon from '@mui/icons-material/FolderRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import TableChartRoundedIcon from '@mui/icons-material/TableChartRounded'
import SlideshowRoundedIcon from '@mui/icons-material/SlideshowRounded'
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded'
import ImageRoundedIcon from '@mui/icons-material/ImageRounded'
import MovieRoundedIcon from '@mui/icons-material/MovieRounded'
import AudioFileRoundedIcon from '@mui/icons-material/AudioFileRounded'
import FolderZipRoundedIcon from '@mui/icons-material/FolderZipRounded'
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded'

// 목업 데이터: DB 연결 전까지 화면 확인용으로만 사용한다.
export const typeMeta = {
  folder: { label: '폴더', icon: FolderRoundedIcon },
  doc: { label: '문서', icon: DescriptionRoundedIcon },
  sheet: { label: '스프레드시트', icon: TableChartRoundedIcon },
  slide: { label: '프레젠테이션', icon: SlideshowRoundedIcon },
  pdf: { label: 'PDF', icon: PictureAsPdfRoundedIcon },
  image: { label: '이미지', icon: ImageRoundedIcon },
  video: { label: '영상', icon: MovieRoundedIcon },
  audio: { label: '오디오', icon: AudioFileRoundedIcon },
  zip: { label: '압축 파일', icon: FolderZipRoundedIcon },
  other: { label: '파일', icon: InsertDriveFileRoundedIcon },
}

const GB = 1024 ** 3
const MB = 1024 ** 2
const KB = 1024

export const storageQuota = 100 * GB

export const sections = [
  { id: 'drive', label: '내 드라이브', eyebrow: 'MY DRIVE' },
  { id: 'recent', label: '최근 항목', eyebrow: 'RECENT' },
  { id: 'shared', label: '공유됨', eyebrow: 'SHARED' },
  { id: 'starred', label: '중요', eyebrow: 'STARRED' },
  { id: 'trash', label: '휴지통', eyebrow: 'TRASH' },
]

export const typeFilters = [
  { id: 'all', label: '전체' },
  { id: 'folder', label: '폴더' },
  { id: 'doc', label: '문서' },
  { id: 'image', label: '이미지' },
  { id: 'video', label: '영상' },
  { id: 'etc', label: '기타' },
]

export const initialFiles = [
  { id: 'f1', name: '2026 프로젝트', type: 'folder', size: 8.4 * GB, modified: '2026-11-20T09:12:00', owner: '나', shared: true, starred: true, items: 42 },
  { id: 'f2', name: '디자인 시안', type: 'folder', size: 12.6 * GB, modified: '2026-11-19T17:40:00', owner: '나', shared: true, starred: false, items: 128 },
  { id: 'f3', name: '계약서 보관', type: 'folder', size: 640 * MB, modified: '2026-11-14T11:05:00', owner: '나', shared: false, starred: true, items: 19 },
  { id: 'f4', name: '팀 공유 자료', type: 'folder', size: 3.2 * GB, modified: '2026-11-10T15:20:00', owner: '김하늘', shared: true, starred: false, items: 57 },
  { id: 'd1', name: '서비스 기획안_v3.docx', type: 'doc', size: 2.4 * MB, modified: '2026-11-20T10:30:00', owner: '나', shared: true, starred: true },
  { id: 'd2', name: '4분기 매출 정리.xlsx', type: 'sheet', size: 860 * KB, modified: '2026-11-19T14:02:00', owner: '박지민', shared: true, starred: false },
  { id: 'd3', name: '브랜드 가이드.pdf', type: 'pdf', size: 18.7 * MB, modified: '2026-11-18T09:45:00', owner: '나', shared: false, starred: true },
  { id: 'd4', name: '주간 회의 발표.pptx', type: 'slide', size: 34.1 * MB, modified: '2026-11-17T16:20:00', owner: '나', shared: true, starred: false },
  { id: 'i1', name: '메인 배너_final.png', type: 'image', size: 4.8 * MB, modified: '2026-11-20T08:15:00', owner: '나', shared: false, starred: false },
  { id: 'i2', name: '워크숍 단체사진.jpg', type: 'image', size: 7.2 * MB, modified: '2026-11-12T19:30:00', owner: '이서준', shared: true, starred: false },
  { id: 'v1', name: '제품 소개 영상.mp4', type: 'video', size: 2.9 * GB, modified: '2026-11-16T13:10:00', owner: '나', shared: true, starred: true },
  { id: 'v2', name: '온보딩 녹화본.mov', type: 'video', size: 5.6 * GB, modified: '2026-11-08T10:00:00', owner: '나', shared: false, starred: false },
  { id: 'a1', name: '팟캐스트 원본.wav', type: 'audio', size: 412 * MB, modified: '2026-11-06T21:45:00', owner: '나', shared: false, starred: false },
  { id: 'z1', name: '소스코드 백업.zip', type: 'zip', size: 1.3 * GB, modified: '2026-11-05T18:25:00', owner: '나', shared: false, starred: false },
]

export const activities = [
  { id: 'ac1', who: '나', action: '업로드', target: '서비스 기획안_v3.docx', at: '2026-11-20T10:30:00' },
  { id: 'ac2', who: '박지민', action: '수정', target: '4분기 매출 정리.xlsx', at: '2026-11-19T14:02:00' },
  { id: 'ac3', who: '김하늘', action: '댓글', target: '디자인 시안', at: '2026-11-19T11:20:00' },
  { id: 'ac4', who: '나', action: '공유', target: '제품 소개 영상.mp4', at: '2026-11-16T13:12:00' },
]

const docTypes = ['doc', 'sheet', 'slide', 'pdf']

export function matchesTypeFilter(file, filter) {
  if (filter === 'all') return true
  if (filter === 'doc') return docTypes.includes(file.type)
  if (filter === 'etc') return ['audio', 'zip', 'other'].includes(file.type)
  return file.type === filter
}

const extensionTypes = {
  doc: ['doc', 'docx', 'hwp', 'txt', 'md'],
  sheet: ['xls', 'xlsx', 'csv'],
  slide: ['ppt', 'pptx', 'key'],
  pdf: ['pdf'],
  image: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'heic'],
  video: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
  audio: ['mp3', 'wav', 'm4a', 'flac'],
  zip: ['zip', 'rar', '7z', 'tar', 'gz'],
}

export function typeFromName(name) {
  const ext = name.split('.').pop().toLowerCase()
  const found = Object.entries(extensionTypes).find(([, list]) => list.includes(ext))
  return found ? found[0] : 'other'
}

export function formatBytes(bytes) {
  if (bytes < KB) return `${bytes} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let value = bytes / KB
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return `${value >= 100 ? Math.round(value) : value.toFixed(1)} ${units[unit]}`
}

const dateFormatter = new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric' })
const timeFormatter = new Intl.DateTimeFormat('ko-KR', { hour: 'numeric', minute: '2-digit' })

export function formatDate(iso) {
  const date = new Date(iso)
  const today = new Date()
  if (date.toDateString() === today.toDateString()) return `오늘 ${timeFormatter.format(date)}`
  return dateFormatter.format(date)
}
