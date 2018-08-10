import { promisify } from 'util';
import glob from 'glob'

const asyncGlob = promisify(glob)

export const searchChangelogs = async (folder: string) => {
    const matchedFiles = await asyncGlob(folder, {follow: true})

    return matchedFiles
}
