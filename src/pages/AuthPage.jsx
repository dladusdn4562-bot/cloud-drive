import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CloudRoundedIcon from '@mui/icons-material/CloudRounded'

const errorMessages = {
  'Invalid login credentials': '이메일 또는 비밀번호가 맞지 않아요.',
  'Email not confirmed': '이메일 인증이 아직 완료되지 않았어요. 받은 메일의 링크를 눌러 주세요.',
  'User already registered': '이미 가입된 이메일이에요.',
  'email rate limit exceeded': '가입 요청이 많아 메일을 보낼 수 없어요. 잠시 후 다시 시도해 주세요.',
}

function AuthPage({ onSignIn, onSignUp }) {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState(null)

  const isSignUp = mode === 'signup'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setPending(true)
    setMessage(null)
    const { data, error } = isSignUp ? await onSignUp(email, password) : await onSignIn(email, password)
    setPending(false)
    if (error) {
      setMessage({ severity: 'error', text: errorMessages[error.message] ?? error.message })
      return
    }
    if (isSignUp && !data.session) {
      setMessage({ severity: 'success', text: '가입 확인 메일을 보냈어요. 메일의 링크를 누른 뒤 로그인해 주세요.' })
    }
  }

  return (
    <Box
      component="main"
      sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', px: 2, py: 6, bgcolor: 'background.default' }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 420,
          p: { xs: 3, sm: 4 },
          borderRadius: '24px',
          border: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 3 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
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

        <Typography variant="h1" component="h1">
          {isSignUp ? '계정 만들기' : '다시 오신 걸 환영해요'}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, mb: 3, color: 'text.secondary' }}>
          로그인하면 내 파일을 안전하게 올리고 받을 수 있어요.
        </Typography>

        <Tabs
          value={mode}
          onChange={(event, next) => {
            setMode(next)
            setMessage(null)
          }}
          variant="fullWidth"
          aria-label="로그인 또는 회원가입"
          sx={{ mb: 3 }}
        >
          <Tab value="signin" label="로그인" />
          <Tab value="signup" label="회원가입" />
        </Tabs>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
          <TextField
            label="이메일"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            label="비밀번호"
            type="password"
            name="password"
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            helperText={isSignUp ? '6자 이상 입력해 주세요.' : undefined}
            slotProps={{ htmlInput: { minLength: 6 } }}
          />
          {message && <Alert severity={message.severity}>{message.text}</Alert>}
          <Button type="submit" variant="contained" size="large" disabled={pending}>
            {pending ? '처리 중…' : isSignUp ? '회원가입' : '로그인'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default AuthPage
