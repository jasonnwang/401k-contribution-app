import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '../../data/contribution.json');

/**
 * Read data from the JSON file
 */
async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty structure
    if (error.code === 'ENOENT') {
      return { users: {} };
    }
    throw error;
  }
}

/**
 * Write data to the JSON file
 */
async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Get contribution settings for a user
 * Business logic: Extract and format user's contribution preferences
 */
async function getSettings(userId) {
  const data = await readData();
  
  const user = data.users[userId];
  
  // Business logic: Check if user exists
  if (!user) {
    return {
      success: false,
      error: {
        code: 'USER_NOT_FOUND',
        message: `User with ID ${userId} not found`
      }
    };
  }

  // Return the settings
  return {
    success: true,
    data: {
      contributionType: user.contributionType,
      contributionValue: user.contributionValue
    }
  };
}

/**
 * Update contribution settings for a user
 * Business logic: Validate and apply contribution type/value rules
 */
async function updateSettings(userId, settings) {
  const data = await readData();
  
  const user = data.users[userId];
  
  if (!user) {
    return {
      success: false,
      error: {
        code: 'USER_NOT_FOUND',
        message: `User with ID ${userId} not found`
      }
    };
  }

  // Business logic: Validate contribution value based on type
  const { contributionType, contributionValue } = settings;
  
  if (contributionType === 'percentage') {
    if (contributionValue < 0 || contributionValue > 100) {
      return {
        success: false,
        error: {
          code: 'INVALID_CONTRIBUTION_VALUE',
          message: 'Contribution value must be between 0 and 100 for percentage type'
        }
      };
    }
  } else if (contributionType === 'fixed') {
    if (contributionValue < 0) {
      return {
        success: false,
        error: {
          code: 'INVALID_CONTRIBUTION_VALUE',
          message: 'Contribution value must be greater than or equal to 0 for fixed type'
        }
      };
    }
  }

  // Update user settings
  user.contributionType = contributionType;
  user.contributionValue = contributionValue;

  await writeData(data);

  return {
    success: true,
    data: {
      contributionType: user.contributionType,
      contributionValue: user.contributionValue
    }
  };
}

/**
 * Get YTD contribution data for a user
 * Business logic: Calculate and format year-to-date statistics
 */
async function getYTD(userId) {
  const data = await readData();
  
  const user = data.users[userId];
  
  if (!user) {
    return {
      success: false,
      error: {
        code: 'USER_NOT_FOUND',
        message: `User with ID ${userId} not found`
      }
    };
  }

  // Business logic: Format YTD data with current year information
  const currentYear = new Date().getFullYear();
  const currentYearStart = `${currentYear}-01-01`;

  return {
    success: true,
    data: {
      ytdContributions: user.ytdContributions,
      ytdPaychecks: user.ytdPaychecks,
      currentYearStart: currentYearStart,
      mockData: {
        annualSalary: user.annualSalary,
        payFrequency: user.payFrequency
      }
    }
  };
}

export { getSettings, updateSettings, getYTD };