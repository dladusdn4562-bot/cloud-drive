import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Typography from '@mui/material/Typography'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'

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
        aria-label="파일 업로드: 클릭해서 파일을 고르거나 화면에 끌어다 놓으세요"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: { xs: 2.5, sm: 3 },
          px: { xs: 2.5, sm: 4 },
          py: { xs: 3, sm: 3.5 },
          textAlign: 'left',
          color: '#FFFFFF',
          borderRadius: '24px',
          backgroundImage: (theme) => theme.gradient.point,
          backgroundSize: '200% 100%',
          backgroundPosition: '0% 50%',
          transition: (theme) => `background-position 900ms ${theme.transitions.easing.easeOut}, ${theme.motion.hover}`,
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '-60%',
            right: '-10%',
            width: { xs: 220, sm: 320 },
            height: { xs: 220, sm: 320 },
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 70%)',
            pointerEvents: 'none',
          },
          '&:hover': { backgroundPosition: '100% 50%' },
          '&:hover .upload-arrow': { transform: 'translateX(4px)' },
          '&.Mui-focusVisible': { outline: '3px solid', outlineColor: 'secondary.main', outlineOffset: 3 },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, minWidth: 0 }}>
          <Typography
            variant="overline"
            component="span"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.9 }}
          >
            <CloudUploadOutlinedIcon sx={{ fontSize: 18 }} />
            Drop files anywhere
          </Typography>
          <Typography
            component="span"
            sx={{
              display: 'block',
              mt: 0.75,
              fontSize: { xs: '1.375rem', sm: '1.75rem' },
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.3,
            }}
          >
            파일을 끌어다 놓으면 바로 올라갑니다
          </Typography>
          <Typography
            variant="caption"
            component="span"
            sx={{
              display: 'inline-block',
              mt: 1.5,
              px: 1.25,
              py: 0.5,
              borderRadius: 999,
              bgcolor: 'rgba(0, 0, 0, 0.22)',
              fontWeight: 500,
            }}
          >
            데모 화면: 서버에 저장되지 않고 새로고침하면 사라져요
          </Typography>
        </Box>

        <Box
          component="span"
          sx={{
            position: 'relative',
            zIndex: 1,
            flexShrink: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 2.5,
            height: 44,
            borderRadius: 999,
            bgcolor: '#FFFFFF',
            color: 'grey.900',
            fontWeight: 600,
            fontSize: '0.9375rem',
            boxShadow: '0 6px 20px rgba(17, 17, 17, 0.18)',
          }}
        >
          업로드
          <ArrowForwardRoundedIcon
            className="upload-arrow"
            fontSize="small"
            sx={{ transition: (theme) => `transform 350ms ${theme.transitions.easing.easeOut}` }}
          />
        </Box>
      </ButtonBase>

      <Box
        aria-hidden={!dragging}
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: (theme) => theme.zIndex.modal + 1,
          p: 3,
          backgroundImage: (theme) => theme.gradient.overlay,
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
            border: '2px dashed rgba(255, 255, 255, 0.7)',
            display: 'grid',
            placeItems: 'center',
            textAlign: 'center',
            color: '#FFFFFF',
          }}
        >
          <Box>
            <CloudUploadOutlinedIcon sx={{ fontSize: 64 }} />
            <Typography variant="overline" component="p" sx={{ mt: 1, opacity: 0.9 }}>
              Drop files anywhere
            </Typography>
            <Typography component="p" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, fontWeight: 700, letterSpacing: '-0.02em' }}>
              여기에 놓으면 업로드됩니다
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default UploadDropzone
