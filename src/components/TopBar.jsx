import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Toolbar from '@mui/material/Toolbar'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'

function TopBar({ query, onQueryChange, onMenuClick, onUploadClick, uploading }) {
  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ bgcolor: 'rgba(255, 255, 255, 0.86)', backdropFilter: 'blur(12px)', borderBottom: 1, borderColor: 'divider' }}
    >
      <Toolbar sx={{ gap: { xs: 1, sm: 1.5 }, minHeight: { xs: 64, sm: 72 }, px: { xs: 2, sm: 3 } }}>
        <IconButton
          edge="start"
          onClick={onMenuClick}
          aria-label="메뉴 열기"
          sx={{ display: { md: 'none' } }}
        >
          <MenuRoundedIcon />
        </IconButton>

        <Box
          component="form"
          role="search"
          onSubmit={(event) => event.preventDefault()}
          sx={{
            flex: 1,
            maxWidth: 560,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            height: 44,
            borderRadius: 999,
            bgcolor: 'grey.100',
            border: 1,
            borderColor: 'transparent',
            transition: (theme) => theme.motion.hover,
            '&:focus-within': { bgcolor: 'background.paper', borderColor: 'primary.main' },
          }}
        >
          <SearchRoundedIcon fontSize="small" sx={{ color: 'grey.500' }} />
          <InputBase
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="파일, 폴더 검색"
            inputProps={{ 'aria-label': '파일, 폴더 검색' }}
            sx={{ flex: 1, fontSize: '0.9375rem' }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
          <Button
            variant="contained"
            startIcon={<FileUploadOutlinedIcon />}
            onClick={onUploadClick}
            disabled={uploading}
            sx={{ minWidth: 0, px: { xs: 1.75, sm: 2.25 } }}
          >
            {uploading ? '업로드 중' : '업로드'}
          </Button>
          <Avatar
            sx={{ width: 36, height: 36, ml: 0.5, bgcolor: 'grey.800', fontSize: '0.875rem', display: { xs: 'none', sm: 'flex' } }}
            alt="내 계정"
          >
            나
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default TopBar
