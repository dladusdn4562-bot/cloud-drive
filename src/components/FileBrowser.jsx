import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import FileCard from './FileCard.jsx'
import { formatBytes, formatDate, typeFilters, typeMeta } from '../data/files.js'

const hideOnMobile = { display: { xs: 'none', sm: 'table-cell' } }

function FileBrowser({ files, view, onViewChange, filter, onFilterChange, selectedId, onSelect, onToggleStar, emptyMessage }) {
  const handleRowKey = (event, id) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(id)
    }
  }

  return (
    <Box component="section" aria-labelledby="file-list-title">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <Typography id="file-list-title" variant="h2" component="h2" sx={{ mr: 'auto' }}>
          파일
          <Typography component="span" variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
            {files.length}
          </Typography>
        </Typography>
        <ToggleButtonGroup
          value={view}
          exclusive
          size="small"
          onChange={(event, next) => next && onViewChange(next)}
          aria-label="보기 방식"
        >
          <ToggleButton value="grid" aria-label="그리드 보기">
            <GridViewRoundedIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="list" aria-label="리스트 보기">
            <ViewListRoundedIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box
        role="group"
        aria-label="파일 종류 필터"
        sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5, mb: 2.5, scrollbarWidth: 'none' }}
      >
        {typeFilters.map((item) => {
          const active = filter === item.id
          return (
            <Chip
              key={item.id}
              label={item.label}
              clickable
              onClick={() => onFilterChange(item.id)}
              aria-pressed={active}
              variant={active ? 'filled' : 'outlined'}
              sx={{
                flexShrink: 0,
                borderColor: 'divider',
                bgcolor: active ? 'grey.900' : 'background.paper',
                color: active ? '#FFFFFF' : 'text.secondary',
                '&:hover': { bgcolor: active ? 'grey.800' : 'grey.100' },
                '&.MuiChip-clickable:hover': { bgcolor: active ? 'grey.800' : 'grey.100' },
              }}
            />
          )
        })}
      </Box>

      {files.length === 0 ? (
        <Box
          sx={{
            py: 8,
            textAlign: 'center',
            border: 1,
            borderStyle: 'dashed',
            borderColor: 'divider',
            borderRadius: '16px',
            color: 'text.secondary',
          }}
        >
          <InboxOutlinedIcon sx={{ fontSize: 40, color: 'grey.400' }} />
          <Typography variant="body2" sx={{ mt: 1 }}>
            {emptyMessage}
          </Typography>
        </Box>
      ) : view === 'grid' ? (
        <Box
          component="ul"
          sx={{
            listStyle: 'none',
            m: 0,
            p: 0,
            display: 'grid',
            gap: { xs: 1.5, sm: 2 },
            gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(auto-fill, minmax(184px, 1fr))' },
          }}
        >
          {files.map((file) => (
            <li key={file.id}>
              <FileCard
                file={file}
                selected={selectedId === file.id}
                onSelect={onSelect}
                onToggleStar={onToggleStar}
              />
            </li>
          ))}
        </Box>
      ) : (
        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: '16px', bgcolor: 'background.paper', overflow: 'hidden' }}>
          <Table size="small" aria-label="파일 목록">
            <TableHead>
              <TableRow sx={{ '& th': { color: 'text.secondary', fontWeight: 600, borderColor: 'divider', py: 1.25 } }}>
                <TableCell>이름</TableCell>
                <TableCell sx={hideOnMobile}>소유자</TableCell>
                <TableCell sx={hideOnMobile}>수정일</TableCell>
                <TableCell align="right">크기</TableCell>
                <TableCell padding="checkbox">
                  <Box component="span" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                    중요
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file) => {
                const { icon: Icon } = typeMeta[file.type]
                const selected = selectedId === file.id
                return (
                  <TableRow
                    key={file.id}
                    hover
                    selected={selected}
                    tabIndex={0}
                    aria-selected={selected}
                    onClick={() => onSelect(file.id)}
                    onKeyDown={(event) => handleRowKey(event, file.id)}
                    sx={{
                      cursor: 'pointer',
                      '& td': { borderColor: 'divider', py: 1.25 },
                      '&.Mui-selected, &.Mui-selected:hover': { bgcolor: 'accent.50' },
                      '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 },
                    }}
                  >
                    <TableCell sx={{ maxWidth: 0, width: '50%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            flexShrink: 0,
                            borderRadius: '8px',
                            display: 'grid',
                            placeItems: 'center',
                            bgcolor: (theme) => alpha(theme.palette.fileType[file.type], 0.1),
                            color: `fileType.${file.type}`,
                          }}
                        >
                          <Icon fontSize="small" />
                        </Box>
                        <Typography variant="body2" noWrap sx={{ fontWeight: 500 }} title={file.name}>
                          {file.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ ...hideOnMobile, color: 'text.secondary' }}>{file.owner}</TableCell>
                    <TableCell sx={{ ...hideOnMobile, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                      {formatDate(file.modified)}
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                      {formatBytes(file.size)}
                    </TableCell>
                    <TableCell padding="checkbox">
                      <IconButton
                        size="small"
                        onClick={(event) => {
                          event.stopPropagation()
                          onToggleStar(file.id)
                        }}
                        onKeyDown={(event) => event.stopPropagation()}
                        aria-label={file.starred ? `${file.name} 중요 해제` : `${file.name} 중요 표시`}
                        aria-pressed={file.starred}
                        sx={{ color: file.starred ? 'fileType.zip' : 'grey.400' }}
                      >
                        {file.starred ? <StarRoundedIcon fontSize="small" /> : <StarBorderRoundedIcon fontSize="small" />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  )
}

export default FileBrowser
