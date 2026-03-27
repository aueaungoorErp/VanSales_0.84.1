/**
 * Authentication Domain Service
 * 
 * Encapsulates authentication business logic without React Native or Redux dependencies.
 * Responsible for:
 * - User login/registration
 * - Token management
 * - Device registration
 * - Authentication state
 * 
 * Usage:
 *   const authService = new AuthService();
 *   const result = await authService.login({ username, password });
 *   if (result.success) {
 *     store.dispatch(setUserToken(result.token));
 *   }
 */

import { loginApi, registerV3Api } from '../../api/user';
import { getUserToken, getDeviceUniqeId } from '../../utils/Token';

class AuthService {
  
  /**
   * Authenticate user with credentials
   * @param {LoginCredentials} credentials - { username, password }
   * @returns {Promise<{ success: boolean, token?: string, data?: any, error?: string }>}
   */
  async login(credentials) {
    try {
      // Validate inputs
      if (!credentials.username || !credentials.password) {
        return {
          success: false,
          error: 'Username and password are required',
        };
      }

      // Call API
      const response = await loginApi(credentials);

      // Handle response
      if (response.STATUS === '00' && response.RESULT_DATA?.USER_TOKEN) {
        return {
          success: true,
          token: response.RESULT_DATA.USER_TOKEN,
          data: response.RESULT_DATA,
        };
      }

      return {
        success: false,
        error: response.STATUS || 'Login failed',
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message || String(error),
      };
    }
  }

  /**
   * Register device and user for V3 API
   * @param {string} username
   * @param {string} password
   * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
   */
  async registerV3(username, password) {
    try {
      // Validate inputs
      if (!username || !password) {
        return {
          success: false,
          error: 'Username and password are required',
        };
      }

      // Verify device unique ID is available
      const uniqueId = await getDeviceUniqeId();
      if (!uniqueId) {
        return {
          success: false,
          error: 'Device registration failed: unable to get device ID',
        };
      }

      // Call API
      const response = await registerV3Api(username, password);

      // Handle response
      if (response.ResponseCode === 200) {
        return {
          success: true,
          data: response,
        };
      }

      return {
        success: false,
        error: response.ReasonString || `Registration failed: ${response.ResponseCode}`,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message || String(error),
      };
    }
  }

  /**
   * Check if user is currently authenticated
   * @returns {Promise<boolean>}
   */
  async isAuthenticated() {
    try {
      const { VANCONFIG } = await getUserToken();
      return !!VANCONFIG;
    } catch {
      return false;
    }
  }

  /**
   * Logout user (clear tokens)
   * @returns {Promise<boolean>} Success status
   */
  async logout() {
    try {
      // TODO: Call logout API when available
      // For now, just clear local state via Redux
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }

  /**
   * Get current authentication status
   * @returns {Promise<AuthState>}
   */
  async getAuthState() {
    try {
      const isAuth = await this.isAuthenticated();
      const { VANCONFIG } = await getUserToken();
      
      return {
        isAuthenticated: isAuth,
        user: VANCONFIG,
      };
    } catch (error) {
      return {
        isAuthenticated: false,
        error: error?.message,
      };
    }
  }
}

// Export singleton instance
export default new AuthService();
