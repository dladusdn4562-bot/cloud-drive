import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import { formatBytes, formatDate, typeMeta } from '../data/files.js'

// 카드 위 보조 버튼: 데스크톱에서는 호버·포커스 때만 보이고, 모바일에서는 항상 보인다.
const floatingButton = {
  position: 'absolute',
  top: 16,
  bgcolor: 'rgba(255, 255, 255, 0.9)',
  transition: 'opacity 200ms',
  '&:hover': { bgcolor: '#FFFFFF' },
}

function FileCard({ file, selected, checked, onSelect, onToggleCheck, onToggleStar, onDownload }) {
  const { icon: Icon, label } = typeMeta[file.type]
  const meta = file.type === 'folder' ? `항목 ${file.items}개` : formatDate(file.modified)
  const hidden = { xs: 1, md: 0 }

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: '16px',
        border: 1,
        borderColor: selected || checked ? 'primary.main' : 'divider',
        bgcolor: selected || checked ? 'accent.50' : 'background.paper',
        transition: (theme) => theme.motion.hover,
        '&:hover': { transform: 'scale(1.03)', borderColor: selected || checked ? 'primary.main' : 'grey.300' },
        '&:hover .card-action, & .card-action:focus-visible, & .card-action.Mui-focusVisible': { opacity: 1 },
      }}
    >
      <ButtonBase
        onClick={() => onSelect(file.id)}
        aria-pressed={selected}
        aria-label={`${file.name}, ${label}, ${meta}`}
        sx={{
          display: 'block',
          width: '100%',
          textAlign: 'left',
          borderRadius: '16px',
          p: 1.25,
          '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
        }}
      >
        <Box
          sx={{
            height: 92,
            borderRadius: '12px',
            display: 'grid',
            placeItems: 'center',
            bgcolor: (theme) => alpha(theme.palette.fileType[file.type], 0.08),
            color: `fileType.${file.type}`,
          }}
        >
          <Icon sx={{ fontSize: 40 }} />
        </Box>
        <Box sx={{ px: 0.5, pt: 1.25, pb: 0.25 }}>
          <Typography variant="subtitle2" noWrap title={file.name}>
            {file.name}
          </Typography>
          <Typography
            variant="caption"
            component="p"
            sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            {file.shared && <PeopleAltOutlinedIcon sx={{ fontSize: 14 }} aria-label="공유됨" />}
            {meta} · {formatBytes(file.size)}
          </Typography>
        </Box>
      </ButtonBase>

      <Checkbox
        className="card-action"
        size="small"
        checked={checked}
        onChange={() => onToggleCheck(file.id)}
        slotProps={{ input: { 'aria-label': `${file.name} 선택` } }}
        sx={{
          ...floatingButton,
          left: 16,
          p: 0.5,
          borderRadius: '8px',
          opacity: checked ? 1 : hidden,
          '&.Mui-checked': { color: 'primary.main' },
        }}
      />

      <Tooltip title="다운로드">
        <IconButton
          className="card-action"
          size="small"
          onClick={() => onDownload(file)}
          aria-label={`${file.name} 다운로드`}
          sx={{ ...floatingButton, right: 52, color: 'grey.700', opacity: hidden }}
        >
          <FileDownloadOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <IconButton
        className="card-action"
        size="small"
        onClick={() => onToggleStar(file.id)}
        aria-label={file.starred ? `${file.name} 중요 해제` : `${file.name} 중요 표시`}
        aria-pressed={file.starred}
        sx={{
          ...floatingButton,
          right: 16,
          color: file.starred ? 'fileType.zip' : 'grey.500',
          opacity: file.starred ? 1 : hidden,
        }}
      >
        {file.starred ? <StarRoundedIcon fontSize="small" /> : <StarBorderRoundedIcon fontSize="small" />}
      </IconButton>
    </Box>
  )
}

export default FileCard
