import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Typography from '@mui/material/Typography'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'

const hasFiles = (event) => Array.from(event.dataTransfer?.types ?? []).includes('Files')

function UploadDropzone({ inputRef, onFiles }) {
  const [dragging, setDragging] = useState(false)
  const depth = useRef(0)

  // 화면 어디에 끌어다 놓아도 업로드되도록 window 단위로 드래그를 감지한다.
  useEffect(() => {
    const handleEnter = (event) => {
      if (!hasFiles(event)) return
      event.preventDefault()
      depth.current += 1
      setDragging(true)
    }
    const handleOver = (event) => {
      if (hasFiles(event)) event.preventDefault()
    }
    const handleLeave = (event) => {
      if (!hasFiles(event)) return
      depth.current = Math.max(0, depth.current - 1)
      if (depth.current === 0) setDragging(false)
    }
    const handleDrop = (event) => {
      if (!hasFiles(event)) return
      event.preventDefault()
      depth.current = 0
      setDragging(false)
      onFiles(event.dataTransfer.files)
    }

    window.addEventListener('dragenter', handleEnter)
    window.addEventListener('dragover', handleOver)
    window.addEventListener('dragleave', handleLeave)
    window.addEventListener('drop', handleDrop)
    return () => {
      window.removeEventListener('dragenter', handleEnter)
      window.removeEventListener('dragover', handleOver)
      window.removeEventListener('dragleave', handleLeave)
      window.removeEventListener('drop', handleDrop)
    }
  }, [onFiles])

  const handleChange = (event) => {
    onFiles(event.target.files)
    event.target.value = ''
  }

  return (
    <>
      <input ref={inputRef} type="file" multiple hidden onChange={handleChange} />

      <ButtonBase
        onClick={() => inputRef.current?.click()}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 2,
          p: { xs: 2, sm: 2.5 },
          textAlign: 'left',
          borderRadius: '16px',
          border: '1.5px dashed',
          borderColor: 'teal.200',
          bgcolor: 'teal.50',
          transition: (theme) => theme.motion.hover,
          '&:hover': { borderColor: 'primary.main', bgcolor: 'teal.100' },
          '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            flexShrink: 0,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            bgcolor: 'background.paper',
            color: 'teal.700',
          }}
        >
          <CloudUploadOutlinedIcon />
        </Box>
        <Box>
          <Typography variant="subtitle2" component="span" sx={{ display: 'block' }}>
            파일을 끌어다 놓거나 클릭해서 업로드하세요
          </Typography>
          <Typography variant="caption" component="span" sx={{ display: 'block', color: 'text.secondary' }}>
            데모 화면이라 파일은 서버에 저장되지 않고, 새로고침하면 목록에서 사라집니다.
          </Typography>
        </Box>
      </ButtonBase>

      <Box
        aria-hidden={!dragging}
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: (theme) => theme.zIndex.modal + 1,
          p: 3,
          bgcolor: 'rgba(230, 251, 250, 0.82)',
          backdropFilter: 'blur(4px)',
          opacity: dragging ? 1 : 0,
          visibility: dragging ? 'visible' : 'hidden',
          pointerEvents: 'none',
          transition: 'opacity 200ms, visibility 200ms',
        }}
      >
        <Box
          sx={{
            height: '100%',
            borderRadius: '24px',
            border: '2px dashed',
            borderColor: 'primary.main',
            display: 'grid',
            placeItems: 'center',
            textAlign: 'center',
            color: 'teal.900',
          }}
        >
          <Box>
            <CloudUploadOutlinedIcon sx={{ fontSize: 56 }} />
            <Typography variant="h2" component="p" sx={{ mt: 1 }}>
              여기에 놓으면 업로드됩니다
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default UploadDropzone
