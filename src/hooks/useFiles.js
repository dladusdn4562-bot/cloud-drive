import { useCallback, useEffect, useState } from 'react'
import { BUCKET, MAX_FILE_SIZE, supabase } from '../lib/supabase.js'
import { typeFromName } from '../data/files.js'

const toFile = (row) => ({
  id: row.id,
  name: row.name,
  type: row.type,
  size: row.size,
  modified: row.created_at,
  owner: '나',
  shared: false,
  starred: row.starred,
  storagePath: row.storage_path,
})

function useFiles(userId) {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  // 목록 조회: RLS로 로그인한 사용자 본인의 파일만 돌아온다.
  useEffect(() => {
    if (!userId) return undefined
    let active = true
    supabase
      .from('files')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!active) return
        if (!error) setFiles(data.map(toFile))
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [userId])

  // 업로드: Storage에 원본을 올리고 files 테이블에 메타데이터를 저장한다.
  const upload = useCallback(async (fileList) => {
    const list = Array.from(fileList ?? [])
    const tooBig = list.filter((file) => file.size > MAX_FILE_SIZE)
    const targets = list.filter((file) => file.size <= MAX_FILE_SIZE)
    let done = 0
    setUploading(true)
    for (const file of targets) {
      const ext = file.name.includes('.') ? `.${file.name.split('.').pop()}` : ''
      const path = `${userId}/${crypto.randomUUID()}${ext}`
      const { error: storageError } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type || undefined })
      if (storageError) continue
      const { data, error } = await supabase
        .from('files')
        .insert({ name: file.name, type: typeFromName(file.name), size: file.size, storage_path: path })
        .select()
        .single()
      if (error) {
        await supabase.storage.from(BUCKET).remove([path])
        continue
      }
      setFiles((prev) => [toFile(data), ...prev])
      done += 1
    }
    setUploading(false)
    return { done, failed: targets.length - done, tooBig: tooBig.length }
  }, [userId])

  // 다운로드: 비공개 버킷에서 인증된 요청으로 받아 원래 파일명(한글 포함)으로 저장한다.
  const download = useCallback(async (file) => {
    const { data, error } = await supabase.storage.from(BUCKET).download(file.storagePath)
    if (error) return error
    const url = URL.createObjectURL(data)
    const link = document.createElement('a')
    link.href = url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    return null
  }, [])

  const toggleStar = useCallback(async (id) => {
    const target = files.find((file) => file.id === id)
    if (!target) return
    const starred = !target.starred
    setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, starred } : file)))
    const { error } = await supabase.from('files').update({ starred }).eq('id', id)
    if (error) setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, starred: !starred } : file)))
  }, [files])

  return { files, loading, uploading, upload, download, toggleStar }
}

export default useFiles
