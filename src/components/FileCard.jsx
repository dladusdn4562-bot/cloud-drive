import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import { formatBytes, formatDate, typeMeta } from '../data/files.js'

function FileCard({ file, selected, onSelect, onToggleStar }) {
  const { icon: Icon, label } = typeMeta[file.type]
  const meta = file.type === 'folder' ? `항목 ${file.items}개` : formatDate(file.modified)

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: '16px',
        border: 1,
        borderColor: selected ? 'primary.main' : 'divider',
        bgcolor: selected ? 'accent.50' : 'background.paper',
        transition: (theme) => theme.motion.hover,
        '&:hover': { transform: 'scale(1.03)', borderColor: selected ? 'primary.main' : 'grey.300' },
        '&:hover .star-toggle, & .star-toggle:focus-visible': { opacity: 1 },
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

      <IconButton
        className="star-toggle"
        size="small"
        onClick={() => onToggleStar(file.id)}
        aria-label={file.starred ? `${file.name} 중요 해제` : `${file.name} 중요 표시`}
        aria-pressed={file.starred}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          color: file.starred ? 'fileType.zip' : 'grey.500',
          opacity: file.starred ? 1 : { xs: 1, md: 0 },
          transition: 'opacity 200ms',
          '&:hover': { bgcolor: '#FFFFFF' },
        }}
      >
        {file.starred ? <StarRoundedIcon fontSize="small" /> : <StarBorderRoundedIcon fontSize="small" />}
      </IconButton>
    </Box>
  )
}

export default FileCard
