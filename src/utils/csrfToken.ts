/**
 * CSRF Token Manager
 * Generates and manages CSRF tokens for form submissions
 */

interface CSRFConfig {
  tokenKey: string
  headerName: string
  cookieDomain?: string
  cookiePath?: string
  cookieSecure?: boolean
  cookieSameSite?: 'Strict' | 'Lax' | 'None'
}

const DEFAULT_CONFIG: CSRFConfig = {
  tokenKey: 'X-CSRF-Token',
  headerName: 'X-CSRF-Token',
  cookiePath: '/',
  cookieSecure: true,
  cookieSameSite: 'Lax'
}

class CSRFTokenManager {
  private config: CSRFConfig
  private token: string | null = null
  private readonly TOKEN_LENGTH = 32

  constructor(config: Partial<CSRFConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Generate a random token
   */
  private generateRandomToken(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let token = ''
    for (let i = 0; i < this.TOKEN_LENGTH; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return token
  }

  /**
   * Generate and store CSRF token
   */
  generateToken(): string {
    if (this.token) {
      return this.token
    }

    this.token = this.generateRandomToken()

    // Store in sessionStorage (not localStorage for security)
    try {
      sessionStorage.setItem(this.config.tokenKey, this.token)
    } catch (error) {
      console.warn('Could not store CSRF token in sessionStorage:', error)
    }

    // Also set as cookie for double-submit cookie pattern
    this.setCookie(this.token)

    return this.token
  }

  /**
   * Get current CSRF token
   */
  getToken(): string {
    if (this.token) {
      return this.token
    }

    // Try to retrieve from sessionStorage
    try {
      const stored = sessionStorage.getItem(this.config.tokenKey)
      if (stored) {
        this.token = stored
        return stored
      }
    } catch (error) {
      console.warn('Could not retrieve CSRF token from sessionStorage:', error)
    }

    // Generate new if not found
    return this.generateToken()
  }

  /**
   * Validate CSRF token
   */
  validateToken(providedToken: string): boolean {
    const currentToken = this.getToken()
    return providedToken === currentToken
  }

  /**
   * Refresh CSRF token
   */
  refreshToken(): string {
    // Clear old token
    try {
      sessionStorage.removeItem(this.config.tokenKey)
    } catch (error) {
      console.warn('Could not clear old CSRF token:', error)
    }

    this.token = null

    // Generate new token
    return this.generateToken()
  }

  /**
   * Set CSRF token in cookie
   */
  private setCookie(token: string): void {
    try {
      const cookieOptions: string[] = [
        `${this.config.tokenKey}=${token}`,
        `path=${this.config.cookiePath}`,
        'max-age=3600', // 1 hour
        `SameSite=${this.config.cookieSameSite}`
      ]

      if (this.config.cookieSecure) {
        cookieOptions.push('Secure')
      }

      if (this.config.cookieDomain) {
        cookieOptions.push(`domain=${this.config.cookieDomain}`)
      }

      document.cookie = cookieOptions.join('; ')
    } catch (error) {
      console.warn('Could not set CSRF cookie:', error)
    }
  }

  /**
   * Clear CSRF token
   */
  clearToken(): void {
    this.token = null
    try {
      sessionStorage.removeItem(this.config.tokenKey)
    } catch (error) {
      console.warn('Could not clear CSRF token:', error)
    }

    // Clear cookie
    try {
      document.cookie = `${this.config.tokenKey}=; path=${this.config.cookiePath}; max-age=0`
    } catch (error) {
      console.warn('Could not clear CSRF cookie:', error)
    }
  }

  /**
   * Get CSRF header configuration for API requests
   */
  getHeaderConfig(): Record<string, string> {
    return {
      [this.config.headerName]: this.getToken()
    }
  }
}

// Create singleton instance
let csrfManager: CSRFTokenManager | null = null

export const getCSRFManager = (): CSRFTokenManager => {
  if (!csrfManager) {
    csrfManager = new CSRFTokenManager()
  }
  return csrfManager
}

export const initCSRFProtection = (): void => {
  const manager = getCSRFManager()
  manager.generateToken()
}

export default CSRFTokenManager
