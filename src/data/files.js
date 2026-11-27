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

// 파일 종류·메뉴 정의와 표시용 유틸 함수
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
