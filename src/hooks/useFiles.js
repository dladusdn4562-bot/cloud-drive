import { useCallback, useEffect, useState } from 'react'
import { zip } from 'fflate'
import { BUCKET, MAX_FILE_SIZE, supabase } from '../lib/supabase.js'
import { storageQuota, typeFromName } from '../data/files.js'

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

// 브라우저에서 Blob을 원래 파일명(한글 포함)으로 저장한다.
function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// zip 안에서 같은 이름이 겹치면 "이름 (2).확장자"로 바꾼다.
function uniqueName(name, used) {
  if (!used.has(name)) {
    used.add(name)
    return name
  }
  const dot = name.lastIndexOf('.')
  const base = dot > 0 ? name.slice(0, dot) : name
  const ext = dot > 0 ? name.slice(dot) : ''
  let count = 2
  while (used.has(`${base} (${count})${ext}`)) count += 1
  const next = `${base} (${count})${ext}`
  used.add(next)
  return next
}

const zipAsync = (entries) =>
  new Promise((resolve, reject) => {
    zip(entries, { level: 0 }, (error, data) => (error ? reject(error) : resolve(data)))
  })

function useFiles() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [downloading, setDownloading] = useState(false)

  // 목록 조회: 공개 드라이브라 저장된 모든 파일을 불러온다.
  useEffect(() => {
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
  }, [])

  // 업로드: Storage에 원본을 올리고 files 테이블에 메타데이터를 저장한다. 총 용량은 15GB로 제한한다.
  const upload = useCallback(async (fileList) => {
    const list = Array.from(fileList ?? [])
    const tooBig = list.filter((file) => file.size > MAX_FILE_SIZE)
    let remaining = storageQuota - files.reduce((sum, file) => sum + file.size, 0)
    let overQuota = 0
    let done = 0
    let failed = 0
    setUploading(true)
    for (const file of list.filter((item) => item.size <= MAX_FILE_SIZE)) {
      if (file.size > remaining) {
        overQuota += 1
        continue
      }
      const ext = file.name.includes('.') ? `.${file.name.split('.').pop()}` : ''
      const path = `public/${crypto.randomUUID()}${ext}`
      const { error: storageError } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type || undefined })
      if (storageError) {
        failed += 1
        continue
      }
      const { data, error } = await supabase
        .from('files')
        .insert({ name: file.name, type: typeFromName(file.name), size: file.size, storage_path: path })
        .select()
        .single()
      if (error) {
        failed += 1
        continue
      }
      remaining -= file.size
      setFiles((prev) => [toFile(data), ...prev])
      done += 1
    }
    setUploading(false)
    return { done, failed, tooBig: tooBig.length, overQuota }
  }, [files])

  // 개별 다운로드: 비공개 버킷에서 받아 원래 파일명으로 저장한다.
  const download = useCallback(async (file) => {
    const { data, error } = await supabase.storage.from(BUCKET).download(file.storagePath)
    if (error) return error
    saveBlob(data, file.name)
    return null
  }, [])

  // 여러 파일 다운로드: 하나면 그대로, 여러 개면 zip 하나로 묶어서 받는다.
  const downloadMany = useCallback(async (targets) => {
    const list = targets.filter((file) => file.storagePath)
    if (!list.length) return { done: 0, failed: 0 }
    setDownloading(true)
    if (list.length === 1) {
      const error = await download(list[0])
      setDownloading(false)
      return { done: error ? 0 : 1, failed: error ? 1 : 0 }
    }
    const used = new Set()
    const entries = {}
    let failed = 0
    for (const file of list) {
      const { data, error } = await supabase.storage.from(BUCKET).download(file.storagePath)
      if (error) {
        failed += 1
        continue
      }
      entries[uniqueName(file.name, used)] = new Uint8Array(await data.arrayBuffer())
    }
    const done = Object.keys(entries).length
    if (done) {
      const zipped = await zipAsync(entries)
      const stamp = new Date().toISOString().slice(0, 10)
      saveBlob(new Blob([zipped], { type: 'application/zip' }), `안개드라이브_${stamp}.zip`)
    }
    setDownloading(false)
    return { done, failed }
  }, [download])

  const toggleStar = useCallback(async (id) => {
    const target = files.find((file) => file.id === id)
    if (!target) return
    const starred = !target.starred
    setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, starred } : file)))
    const { error } = await supabase.from('files').update({ starred }).eq('id', id)
    if (error) setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, starred: !starred } : file)))
  }, [files])

  return { files, loading, uploading, downloading, upload, download, downloadMany, toggleStar }
}

export default useFiles
