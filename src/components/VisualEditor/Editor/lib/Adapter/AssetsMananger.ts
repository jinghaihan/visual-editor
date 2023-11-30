import { uuid } from '@/utils'

interface Assets {
  file: File
  reader: Function
}

export class AssetsMananger {
  public assets: Record<string, Assets>

  constructor() {
    this.assets = {}
  }

  set(data, key = uuid()) {
    this.assets[key] = data

    return key
  }

  async get(key: string) {
    const data = this.assets[key]
    const { file, reader } = data
    if (reader) {
      const content = await reader(file)

      return content
    } else {
      return file
    }
  }
}
