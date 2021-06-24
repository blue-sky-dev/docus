import { promises as fs } from 'fs'
import { join, extname } from 'path'
import { createError, Middleware, useBody } from 'h3'
import dirTree from 'directory-tree'
import { FileData, File } from '../../type'
import { normalizeFiles, r } from '../utils'

export default <Middleware>async function contentHandler(req) {
  const url = req.url

  if (req.method === 'GET') {
    // List all files in content/
    if (url === '/') {
      const tree = dirTree(r('content'))
      return normalizeFiles(tree.children, r('content'))
    }
    // Read a single content file
    try {
      const path = join(r('content'), url)
      const file = await fs.readFile(path, 'utf-8')

      return <File>{
        path: path.replace(r('content'), ''),
        extension: extname(path),
        raw: file
      }
    } catch (err) {
      return createError({
        statusCode: 404,
        statusMessage: 'File not found'
      })
    }
  }

  // Update changes
  if (req.method === 'PUT') {
    const { raw } = await useBody<FileData>(req)
    if (raw == null) {
      return createError({
        statusCode: 400,
        statusMessage: '"raw" key is required'
      })
    }

    const path = join(r('content'), url)

    try {
      // @ts-ignore
      // await fs.stat(path, 'utf-8')
      await fs.writeFile(path, raw)

      return { ok: true }
    } catch (err) {
      return createError({
        statusCode: 404,
        statusMessage: 'File not found'
      })
    }
  }

  return createError({
    statusCode: 400,
    statusMessage: 'Bad Request'
  })
}
