import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { alpha, useTheme } from '@mui/material/styles'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { formatBytes, formatDate, typeMeta } from '../data/files.js'

function DetailPanel({ file, activities, open, onClose, onAction }) {
  const theme = useTheme()
  const isWide = useMediaQuery(theme.breakpoints.up('lg'))
  const width = theme.layout.detailWidth

  const content = file ? (
    <FileDetail file={file} onClose={onClose} onAction={onAction} showClose={!isWide} />
  ) : (
    <ActivityList activities={activities} />
  )

  if (isWide) {
    return (
      <Box
        component="aside"
        aria-label={file ? '파일 정보' : '최근 활동'}
        sx={{
          width,
          flexShrink: 0,
          borderLeft: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          position: 'sticky',
          top: 72,
          height: 'calc(100vh - 72px)',
          overflowY: 'auto',
        }}
      >
        {content}
      </Box>
    )
  }

  return (
    <Drawer anchor="right" open={open && Boolean(file)} onClose={onClose} slotProps={{ paper: { sx: { width: { xs: '88vw', sm: width } } } }}>
      {file && content}
    </Drawer>
  )
}

function FileDetail({ file, onClose, onAction, showClose }) {
  const { icon: Icon, label } = typeMeta[file.type]
  const rows = [
    ['종류', label],
    ['크기', formatBytes(file.size)],
    ['소유자', file.owner],
    ['수정일', formatDate(file.modified)],
    ['위치', '내 드라이브'],
  ]

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="overline" sx={{ color: 'grey.500', mr: 'auto' }}>
          Details
        </Typography>
        {showClose && (
          <IconButton size="small" onClick={onClose} aria-label="파일 정보 닫기">
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Box
        sx={{
          height: 148,
          borderRadius: '16px',
          display: 'grid',
          placeItems: 'center',
          bgcolor: (theme) => alpha(theme.palette.fileType[file.type], 0.08),
          color: `fileType.${file.type}`,
        }}
      >
        <Icon sx={{ fontSize: 56 }} />
      </Box>

      <Typography variant="h3" component="h2" sx={{ mt: 2, wordBreak: 'break-all' }}>
        {file.name}
      </Typography>
      <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mt: 1 }}>
        <Chip size="small" label={label} sx={{ bgcolor: 'grey.100' }} />
        {file.shared ? (
          <Chip size="small" label="공유됨" sx={{ bgcolor: 'teal.50', color: 'teal.900' }} />
        ) : (
          <Chip size="small" icon={<LockOutlinedIcon />} label="나만 보기" sx={{ bgcolor: 'grey.100' }} />
        )}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 2.5 }}>
        <Button variant="contained" startIcon={<LinkRoundedIcon />} onClick={() => onAction('공유 링크를 만들었어요 (데모)')}>
          공유
        </Button>
        <Button variant="outlined" startIcon={<FileDownloadOutlinedIcon />} onClick={() => onAction('데모 화면에서는 다운로드할 수 없어요')}>
          받기
        </Button>
      </Box>

      <Divider sx={{ my: 2.5 }} />

      <Box component="dl" sx={{ m: 0, display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: 1.25, columnGap: 2 }}>
        {rows.map(([term, value]) => (
          <Box key={term} sx={{ display: 'contents' }}>
            <Typography component="dt" variant="body2" sx={{ color: 'text.secondary' }}>
              {term}
            </Typography>
            <Typography component="dd" variant="body2" sx={{ m: 0, textAlign: 'right', fontWeight: 500 }}>
              {value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function ActivityList({ activities }) {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="overline" component="p" sx={{ color: 'grey.500' }}>
        Activity
      </Typography>
      <Typography variant="h2" component="h2" sx={{ mb: 2 }}>
        최근 활동
      </Typography>
      <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 2 }}>
        {activities.map((item) => (
          <Box component="li" key={item.id} sx={{ display: 'flex', gap: 1.5 }}>
            <Avatar sx={{ width: 32, height: 32, fontSize: '0.8125rem', bgcolor: item.who === '나' ? 'grey.800' : 'teal.100', color: item.who === '나' ? '#FFFFFF' : 'teal.900' }}>
              {item.who.slice(0, 1)}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2">
                <Box component="strong" sx={{ fontWeight: 600 }}>
                  {item.who}
                </Box>
                님이 {item.action}
              </Typography>
              <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }} title={item.target}>
                {item.target}
              </Typography>
              <Typography variant="caption" sx={{ color: 'grey.500' }}>
                {formatDate(item.at)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
      <Typography variant="caption" component="p" sx={{ mt: 3, color: 'text.secondary' }}>
        파일을 선택하면 상세 정보가 여기에 표시됩니다.
      </Typography>
    </Box>
  )
}

export default DetailPanel
