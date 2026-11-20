import { useCallback, useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import Sidebar from '../components/Sidebar.jsx'
import TopBar from '../components/TopBar.jsx'
import StatsStrip from '../components/StatsStrip.jsx'
import UploadDropzone from '../components/UploadDropzone.jsx'
import FileBrowser from '../components/FileBrowser.jsx'
import DetailPanel from '../components/DetailPanel.jsx'
import { activities, initialFiles, matchesTypeFilter, sections, typeFromName } from '../data/files.js'

const emptyMessages = {
  drive: '조건에 맞는 파일이 없어요.',
  recent: '최근 항목이 없어요.',
  shared: '공유된 파일이 없어요.',
  starred: '중요 표시한 파일이 없어요.',
  trash: '휴지통이 비어 있어요.',
}

const byModified = (a, b) => new Date(b.modified) - new Date(a.modified)
const foldersFirst = (a, b) => (a.type === 'folder') === (b.type === 'folder') ? byModified(a, b) : a.type === 'folder' ? -1 : 1

function DrivePage() {
  const [files, setFiles] = useState(initialFiles)
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

  const handleSelect = (id) => {
    setSelectedId((prev) => (prev === id ? null : id))
    setDetailOpen(true)
  }

  const handleToggleStar = (id) => {
    setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, starred: !file.starred } : file)))
  }

  const handleSectionChange = (id) => {
    setSection(id)
    setSelectedId(null)
  }

  // 업로드: DB 연결 전이라 브라우저 메모리의 목록에만 추가한다.
  const handleFiles = useCallback((fileList) => {
    const added = Array.from(fileList ?? []).map((file, index) => ({
      id: `up-${Date.now()}-${index}`,
      name: file.name,
      type: typeFromName(file.name),
      size: file.size,
      modified: new Date().toISOString(),
      owner: '나',
      shared: false,
      starred: false,
    }))
    if (!added.length) return
    setFiles((prev) => [...added, ...prev])
    setSection('drive')
    setFilter('all')
    setToast(`파일 ${added.length}개를 추가했어요`)
  }, [])

  const handleNewFolder = () => {
    const count = files.filter((file) => file.type === 'folder' && file.name.startsWith('새 폴더')).length
    const folder = {
      id: `folder-${Date.now()}`,
      name: count ? `새 폴더 (${count + 1})` : '새 폴더',
      type: 'folder',
      size: 0,
      modified: new Date().toISOString(),
      owner: '나',
      shared: false,
      starred: false,
      items: 0,
    }
    setFiles((prev) => [folder, ...prev])
    setSection('drive')
    setFilter('all')
    setSelectedId(folder.id)
    setToast(`'${folder.name}'를 만들었어요`)
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
          onNewFolder={handleNewFolder}
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
              <UploadDropzone inputRef={uploadInput} onFiles={handleFiles} />
              <FileBrowser
                files={visibleFiles}
                view={view}
                onViewChange={setView}
                filter={filter}
                onFilterChange={setFilter}
                selectedId={selectedId}
                onSelect={handleSelect}
                onToggleStar={handleToggleStar}
                emptyMessage={query ? `'${query}'에 대한 검색 결과가 없어요.` : emptyMessages[section]}
              />
            </Box>
          </Box>

          <DetailPanel
            file={selectedFile}
            activities={activities}
            open={detailOpen}
            onClose={() => setDetailOpen(false)}
            onAction={setToast}
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
