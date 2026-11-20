import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import CloudRoundedIcon from '@mui/icons-material/CloudRounded'
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import { formatBytes, sections, storageQuota } from '../data/files.js'

const sectionIcons = {
  drive: FolderOpenRoundedIcon,
  recent: ScheduleRoundedIcon,
  shared: PeopleAltRoundedIcon,
  starred: StarRoundedIcon,
  trash: DeleteOutlineRoundedIcon,
}

function Sidebar({ section, onSectionChange, usedBytes, mobileOpen, onClose }) {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const width = theme.layout.sidebarWidth
  const usedPercent = Math.min(100, (usedBytes / storageQuota) * 100)

  const handleSelect = (id) => {
    onSectionChange(id)
    if (!isDesktop) onClose()
  }

  const content = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', px: 2, py: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1, mb: 3 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            bgcolor: 'primary.main',
            color: '#FFFFFF',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <CloudRoundedIcon fontSize="small" />
        </Box>
        <Typography component="p" variant="h2">
          Cloud Drive
        </Typography>
      </Box>

      <Typography variant="overline" sx={{ px: 1.5, color: 'grey.500' }}>
        Workspace
      </Typography>
      <Box component="nav" aria-label="드라이브 메뉴">
        <List disablePadding sx={{ display: 'grid', gap: 0.5, mt: 0.5 }}>
          {sections.map((item) => {
            const Icon = sectionIcons[item.id]
            const selected = section === item.id
            return (
              <ListItemButton
                key={item.id}
                selected={selected}
                aria-current={selected ? 'page' : undefined}
                onClick={() => handleSelect(item.id)}
                sx={{
                  borderRadius: 999,
                  px: 1.5,
                  minHeight: 42,
                  color: 'text.secondary',
                  '&.Mui-selected': { bgcolor: 'teal.50', color: 'teal.900' },
                  '&.Mui-selected:hover': { bgcolor: 'teal.100' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: selected ? 'teal.700' : 'grey.500' }}>
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{ primary: { variant: 'body2', fontWeight: selected ? 600 : 500 } }}
                />
              </ListItemButton>
            )
          })}
        </List>
      </Box>

      <Box
        sx={{
          mt: 'auto',
          p: 2,
          borderRadius: '12px',
          border: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="overline" sx={{ color: 'grey.500' }}>
          Storage
        </Typography>
        <Typography variant="subtitle2" sx={{ mt: 0.25, mb: 1.25 }}>
          {formatBytes(usedBytes)}{' '}
          <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
            / {formatBytes(storageQuota)}
          </Typography>
        </Typography>
        <LinearProgress variant="determinate" value={usedPercent} aria-label="저장 공간 사용량" />
        <Typography variant="caption" component="p" sx={{ mt: 1, color: 'text.secondary' }}>
          {Math.round(usedPercent)}% 사용 중
        </Typography>
      </Box>
    </Box>
  )

  return (
    <Box component="aside" sx={{ width: { md: width }, flexShrink: { md: 0 } }}>
      {isDesktop ? (
        <Drawer
          variant="permanent"
          open
          slotProps={{ paper: { sx: { width, bgcolor: 'background.default', borderColor: 'divider' } } }}
        >
          {content}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onClose}
          ModalProps={{ keepMounted: true }}
          slotProps={{ paper: { sx: { width, bgcolor: 'background.default' } } }}
        >
          {content}
        </Drawer>
      )}
    </Box>
  )
}

export default Sidebar
