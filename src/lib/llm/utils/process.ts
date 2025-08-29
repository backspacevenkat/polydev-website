'use client'

import { spawn } from 'child_process'

export interface ProcessResult {
  stdout: string
  stderr: string
  exitCode: number
}

export interface ExecOptions {
  timeout?: number
  cwd?: string
  env?: Record<string, string>
}

export async function execAsync(
  command: string,
  options: ExecOptions = {}
): Promise<ProcessResult> {
  const { timeout = 30000, cwd, env } = options

  return new Promise((resolve, reject) => {
    const args = command.split(' ')
    const cmd = args[0]
    const cmdArgs = args.slice(1)

    const child = spawn(cmd, cmdArgs, {
      cwd,
      env: { ...process.env, ...env },
      stdio: 'pipe'
    })

    let stdout = ''
    let stderr = ''

    child.stdout?.on('data', (data) => {
      stdout += data.toString()
    })

    child.stderr?.on('data', (data) => {
      stderr += data.toString()
    })

    const timeoutId = setTimeout(() => {
      child.kill('SIGTERM')
      reject(new Error(`Process timed out after ${timeout}ms`))
    }, timeout)

    child.on('close', (code) => {
      clearTimeout(timeoutId)
      resolve({
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode: code || 0
      })
    })

    child.on('error', (error) => {
      clearTimeout(timeoutId)
      reject(error)
    })
  })
}

export async function findExecutable(executableName: string): Promise<string | null> {
  try {
    const which = process.platform === 'win32' ? 'where' : 'which'
    const result = await execAsync(`${which} ${executableName}`)
    
    if (result.exitCode === 0 && result.stdout) {
      return result.stdout.split('\n')[0].trim()
    }
  } catch (error) {
    // Ignore errors, executable not found
  }
  
  return null
}

export function getDefaultInstallPaths(cliName: string): string[] {
  const isWindows = process.platform === 'win32'
  const isMac = process.platform === 'darwin'
  
  const paths: string[] = []
  
  if (cliName === 'codex') {
    if (isWindows) {
      paths.push(
        'C:\\Program Files\\OpenAI\\Codex\\codex.exe',
        'C:\\Users\\%USERNAME%\\AppData\\Local\\OpenAI\\Codex\\codex.exe'
      )
    } else if (isMac) {
      paths.push(
        '/usr/local/bin/codex',
        '/opt/homebrew/bin/codex',
        '/Applications/Codex.app/Contents/MacOS/codex'
      )
    } else {
      paths.push(
        '/usr/local/bin/codex',
        '/usr/bin/codex',
        '~/.local/bin/codex'
      )
    }
  } else if (cliName === 'claude') {
    if (isWindows) {
      paths.push(
        'C:\\Program Files\\Anthropic\\Claude Code\\claude.exe',
        'C:\\Users\\%USERNAME%\\AppData\\Local\\Anthropic\\Claude Code\\claude.exe'
      )
    } else if (isMac) {
      paths.push(
        '/usr/local/bin/claude',
        '/opt/homebrew/bin/claude',
        '/Applications/Claude Code.app/Contents/MacOS/claude'
      )
    } else {
      paths.push(
        '/usr/local/bin/claude',
        '/usr/bin/claude',
        '~/.local/bin/claude'
      )
    }
  } else if (cliName === 'gemini') {
    if (isWindows) {
      paths.push(
        'C:\\Program Files\\Google\\Gemini\\gemini.exe',
        'C:\\Users\\%USERNAME%\\AppData\\Local\\Google\\Gemini\\gemini.exe'
      )
    } else if (isMac) {
      paths.push(
        '/usr/local/bin/gemini',
        '/opt/homebrew/bin/gemini'
      )
    } else {
      paths.push(
        '/usr/local/bin/gemini',
        '/usr/bin/gemini',
        '~/.local/bin/gemini'
      )
    }
  }
  
  return paths
}

export async function detectCliPath(cliName: string): Promise<string | null> {
  // First try to find in PATH
  const pathResult = await findExecutable(cliName)
  if (pathResult) {
    return pathResult
  }
  
  // Try default installation paths
  const defaultPaths = getDefaultInstallPaths(cliName)
  
  for (const path of defaultPaths) {
    try {
      const expandedPath = path.replace('~', process.env.HOME || '')
                              .replace('%USERNAME%', process.env.USERNAME || '')
      
      // Test if executable exists and works
      await execAsync(`"${expandedPath}" --version`, { timeout: 5000 })
      return expandedPath
    } catch (error) {
      // Continue to next path
    }
  }
  
  return null
}