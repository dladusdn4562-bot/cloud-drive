import { useCallback, useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import Sidebar from '../components/Sidebar.jsx'
import TopBar from '../components/TopBar.jsx'
import StatsStrip from '../components/StatsStrip.jsx'
import UploadDropzone from '../components/UploadDropzone.jsx'
import FileBrowser from '../components/FileBrowser.jsx'
import DetailPanel from '../components/DetailPanel.jsx'
import { matchesTypeFilter, sections } from '../data/files.js'
import useFiles from '../hooks/useFiles.js'

const emptyMessages = {
  drive: '아직 올린 파일이 없어요. 파일을 끌어다 놓아 보세요.',
  recent: '최근 항목이 없어요.',
  shared: '공유된 파일이 없어요.',
  starred: '중요 표시한 파일이 없어요.',
  trash: '휴지통이 비어 있어요.',
}

const byModified = (a, b) => new Date(b.modified) - new Date(a.modified)
const foldersFirst = (a, b) => (a.type === 'folder') === (b.type === 'folder') ? byModified(a, b) : a.type === 'folder' ? -1 : 1

function DrivePage() {
  const { files, loading, uploading, upload, download, toggleStar } = useFiles()
  const [section, setSection] = useState('drive')
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [view, setView] = useState('grid')
  const [selectedId, setSelectedId] = useState(null)
  const [navOpen, setNavOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [toast, setToast] = useState('')
  const uploadInput = useRef(null)

  const current = sections.find((item) => item.id === section)
  const usedBytes = useMemo(() => files.reduce((sum, file) => sum + file.size, 0), [files])

  const visibleFiles = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    let list = files
    if (section === 'recent') list = [...files].sort(byModified).slice(0, 8)
    else if (section === 'shared') list = files.filter((file) => file.shared)
    else if (section === 'starred') list = files.filter((file) => file.starred)
    else if (section === 'trash') list = []
    else list = [...files].sort(foldersFirst)

    return list
      .filter((file) => matchesTypeFilter(file, filter))
      .filter((file) => !keyword || file.name.toLowerCase().includes(keyword))
  }, [files, section, filter, query])

  const selectedFile = files.find((file) => file.id === selectedId) ?? null

  const activities = useMemo(
    () => files.slice(0, 5).map((file) => ({ id: file.id, who: '나', action: '업로드', target: file.name, at: file.modified })),
    [files],
  )

  const handleSelect = (id) => {
    setSelectedId((prev) => (prev === id ? null : id))
    setDetailOpen(true)
  }

  const handleSectionChange = (id) => {
    setSection(id)
    setSelectedId(null)
  }

  // 업로드: Supabase Storage에 원본을 저장하고 목록에 반영한다.
  const handleFiles = useCallback(async (fileList) => {
    if (!fileList?.length || uploading) return
    setSection('drive')
    setFilter('all')
    setToast('업로드 중이에요…')
    const { done, failed, tooBig } = await upload(fileList)
    const notes = [
      done && `${done}개 업로드 완료`,
      failed && `${failed}개 실패`,
      tooBig && `${tooBig}개는 50MB를 넘어 제외`,
    ].filter(Boolean)
    setToast(notes.join(' · ') || '업로드할 파일이 없어요')
  }, [upload, uploading])

  const handleDownload = async (file) => {
    const error = await download(file)
    setToast(error ? '다운로드에 실패했어요' : `'${file.name}' 다운로드를 시작했어요`)
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar
        section={section}
        onSectionChange={handleSectionChange}
        usedBytes={usedBytes}
        mobileOpen={navOpen}
        onClose={() => setNavOpen(false)}
      />

      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopBar
          query={query}
          onQueryChange={setQuery}
          onMenuClick={() => setNavOpen(true)}
          onUploadClick={() => uploadInput.current?.click()}
          uploading={uploading}
        />

        <Box sx={{ flex: 1, display: 'flex', minWidth: 0 }}>
          <Box component="main" sx={{ flex: 1, minWidth: 0, px: { xs: 2, sm: 3, xl: 5 }, py: { xs: 3, sm: 4 } }}>
            <Box component="header" sx={{ mb: 3 }}>
              <Typography variant="overline" component="p" sx={{ color: 'teal.700' }}>
                {current.eyebrow}
              </Typography>
              <Typography variant="h1">{current.label}</Typography>
              <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                팀의 모든 파일을 한곳에서 정리하고 공유하세요.
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gap: { xs: 2.5, sm: 3 } }}>
              <StatsStrip files={files} usedBytes={usedBytes} />
              <UploadDropzone inputRef={uploadInput} onFiles={handleFiles} uploading={uploading} />
              {loading && <LinearProgress aria-label="파일 목록 불러오는 중" />}
              <FileBrowser
                files={visibleFiles}
                view={view}
                onViewChange={setView}
                filter={filter}
                onFilterChange={setFilter}
                selectedId={selectedId}
                onSelect={handleSelect}
                onToggleStar={toggleStar}
                emptyMessage={loading ? '불러오는 중이에요…' : query ? `'${query}'에 대한 검색 결과가 없어요.` : emptyMessages[section]}
              />
            </Box>
          </Box>

          <DetailPanel
            file={selectedFile}
            activities={activities}
            open={detailOpen}
            onClose={() => setDetailOpen(false)}
            onAction={setToast}
            onDownload={handleDownload}
          />
        </Box>
      </Box>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={2800}
        onClose={() => setToast('')}
        message={toast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  )
}

export default DrivePage
