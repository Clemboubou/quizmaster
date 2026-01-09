/**
 * Configuration globale pour les tests Vitest
 */
import { vi } from 'vitest'

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock de window.location
delete window.location
window.location = { href: '', assign: vi.fn(), replace: vi.fn() }

// Reset les mocks avant chaque test
beforeEach(() => {
  vi.clearAllMocks()
  localStorageMock.getItem.mockReturnValue(null)
})
