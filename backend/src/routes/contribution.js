import { getSettings, updateSettings, getYTD } from '../controllers/contribution.js';

/**
 * GET /api/users/:userId/contribution/settings
 * Get contribution settings for a user
 */
export async function getSettingsHandler(req, res) {
  try {
    const { userId } = req.params;
    
    const result = await getSettings(userId);
    
    if (!result.success) {
      const statusCode = result.error.code === 'USER_NOT_FOUND' ? 404 : 500;
      return res.status(statusCode).json({ error: result.error });
    }
    
    return res.status(200).json(result.data);
  } catch (error) {
    console.error('Error in GET /contribution/settings:', error);
    return res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
}


/**
 * PUT /api/users/:userId/contribution/settings
 * Update contribution settings for a user
 */
export async function updateSettingsHandler(req, res) {
  try {
    const { userId } = req.params;
    const { contributionType, contributionValue } = req.body;
    
    const result = await updateSettings(userId, { contributionType, contributionValue });
    
    if (!result.success) {
      let statusCode = 500;
      if (result.error.code === 'USER_NOT_FOUND') statusCode = 404;
      if (result.error.code === 'INVALID_CONTRIBUTION_VALUE') statusCode = 400;
      
      return res.status(statusCode).json({ error: result.error });
    }
    
    return res.status(200).json(result.data);
  } catch (error) {
    console.error('Error in PUT /contribution/settings:', error);
    return res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
}

/**
 * GET /api/users/:userId/contribution/ytd
 * Get YTD contribution data for a user
 */
export async function getYTDHandler(req, res) {
  try {
    const { userId } = req.params;
    
    const result = await getYTD(userId);
    
    if (!result.success) {
      const statusCode = result.error.code === 'USER_NOT_FOUND' ? 404 : 500;
      return res.status(statusCode).json({ error: result.error });
    }
    
    return res.status(200).json(result.data);
  } catch (error) {
    console.error('Error in GET /contribution/ytd:', error);
    return res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
}

