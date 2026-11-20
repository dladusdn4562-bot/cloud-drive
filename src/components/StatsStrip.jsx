import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { formatBytes, storageQuota } from '../data/files.js'

function StatsStrip({ files, usedBytes }) {
  const stats = [
    { label: 'Files', title: '전체 항목', value: `${files.length}개`, note: `폴더 ${files.filter((file) => file.type === 'folder').length}개 포함` },
    { label: 'Storage', title: '사용 용량', value: formatBytes(usedBytes), note: `${formatBytes(storageQuota)} 중` },
    { label: 'Shared', title: '공유 중', value: `${files.filter((file) => file.shared).length}개`, note: '링크·멤버 공유' },
    { label: 'Starred', title: '중요 표시', value: `${files.filter((file) => file.starred).length}개`, note: '빠른 접근' },
  ]

  return (
    <Box
      component="section"
      aria-label="드라이브 요약"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
        border: 1,
        borderColor: 'divider',
        borderRadius: '16px',
        bgcolor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      {stats.map((stat, index) => (
        <Box
          key={stat.label}
          sx={{
            p: { xs: 2, sm: 2.5 },
            borderLeftStyle: 'solid',
            borderTopStyle: 'solid',
            borderLeftWidth: { xs: index % 2 ? 1 : 0, lg: index ? 1 : 0 },
            borderTopWidth: { xs: index > 1 ? 1 : 0, lg: 0 },
            borderColor: 'divider',
          }}
        >
          <Typography variant="overline" component="p" sx={{ color: 'grey.500' }}>
            {stat.label}
          </Typography>
          <Typography variant="statNumber" component="p" sx={{ mt: 0.5 }}>
            {stat.value}
          </Typography>
          <Typography variant="caption" component="p" sx={{ mt: 0.5, color: 'text.secondary' }}>
            {stat.title} · {stat.note}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

export default StatsStrip
