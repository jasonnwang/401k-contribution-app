import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';

let mockData = {
  users: {
    "123": {
      contributionType: "percentage",
      contributionValue: 5,
      ytdContributions: 5000,
      ytdPaychecks: 24,
      annualSalary: 60000,
      payFrequency: "biweekly"
    },
    "456": {
      contributionType: "fixed",
      contributionValue: 200,
      ytdContributions: 4800,
      ytdPaychecks: 24,
      annualSalary: 75000,
      payFrequency: "biweekly"
    }
  }
};

vi.mock('fs/promises', () => ({
  default: {
    readFile: vi.fn(() => Promise.resolve(JSON.stringify(mockData))),
    writeFile: vi.fn(() => Promise.resolve())
  }
}));

const { default: app } = await import('../src/app.js');

beforeEach(() => {
  mockData = {
    users: {
      "123": {
        contributionType: "percentage",
        contributionValue: 5,
        ytdContributions: 5000,
        ytdPaychecks: 24,
        annualSalary: 60000,
        payFrequency: "biweekly"
      },
      "456": {
        contributionType: "fixed",
        contributionValue: 200,
        ytdContributions: 4800,
        ytdPaychecks: 24,
        annualSalary: 75000,
        payFrequency: "biweekly"
      }
    }
  };
});

// --------------- GET /api/users/:userId/contribution/settings tests ---------------

describe('GET /api/users/:userId/contribution/settings', () => {
  it('returns 200 for valid user', async () => {
    await request(app)
      .get('/api/users/123/contribution/settings')
      .expect(200);
  });

  it('returns contributionType property', async () => {
    const response = await request(app)
      .get('/api/users/123/contribution/settings');
    expect(response.body).toHaveProperty('contributionType');
  });

  it('returns contributionValue property', async () => {
    const response = await request(app)
      .get('/api/users/123/contribution/settings');
    expect(response.body).toHaveProperty('contributionValue');
  });

  it('returns correct contributionType for user 123', async () => {
    const response = await request(app)
      .get('/api/users/123/contribution/settings');
    expect(response.body.contributionType).toBe('percentage');
  });

  it('returns correct contributionValue for user 123', async () => {
    const response = await request(app)
      .get('/api/users/123/contribution/settings');
    expect(response.body.contributionValue).toBe(5);
  });

  it('returns 404 for non-existent user', async () => {
    await request(app)
      .get('/api/users/999/contribution/settings')
      .expect(404);
  });

  it('returns error object for non-existent user', async () => {
    const response = await request(app)
      .get('/api/users/999/contribution/settings');
    expect(response.body).toHaveProperty('error');
  });

  it('returns USER_NOT_FOUND error code', async () => {
    const response = await request(app)
      .get('/api/users/999/contribution/settings');
    expect(response.body.error.code).toBe('USER_NOT_FOUND');
  });

  it('returns 400 for invalid userId format', async () => {
    await request(app)
      .get('/api/users/abc/contribution/settings')
      .expect(400);
  });
});

// --------------- PUT /api/users/:userId/contribution/settings tests ---------------

describe('PUT /api/users/:userId/contribution/settings', () => {
  it('returns 200 for valid update', async () => {
    await request(app)
      .put('/api/users/123/contribution/settings')
      .send({ contributionType: 'fixed', contributionValue: 250 })
      .expect(200);
  });

  it('returns updated contributionType', async () => {
    const response = await request(app)
      .put('/api/users/123/contribution/settings')
      .send({ contributionType: 'fixed', contributionValue: 250 });
    expect(response.body.contributionType).toBe('fixed');
  });

  it('returns updated contributionValue', async () => {
    const response = await request(app)
      .put('/api/users/123/contribution/settings')
      .send({ contributionType: 'fixed', contributionValue: 250 });
    expect(response.body.contributionValue).toBe(250);
  });

  it('returns 404 for non-existent user', async () => {
    await request(app)
      .put('/api/users/999/contribution/settings')
      .send({ contributionType: 'percentage', contributionValue: 10 })
      .expect(404);
  });

  it('returns 400 for percentage over 100', async () => {
    await request(app)
      .put('/api/users/123/contribution/settings')
      .send({ contributionType: 'percentage', contributionValue: 150 })
      .expect(400);
  });

  it('returns 400 for negative percentage', async () => {
    await request(app)
      .put('/api/users/123/contribution/settings')
      .send({ contributionType: 'percentage', contributionValue: -5 })
      .expect(400);
  });

  it('returns 400 for negative fixed amount', async () => {
    await request(app)
      .put('/api/users/123/contribution/settings')
      .send({ contributionType: 'fixed', contributionValue: -100 })
      .expect(400);
  });

  it('returns INVALID_CONTRIBUTION_VALUE error code for invalid percentage', async () => {
    const response = await request(app)
      .put('/api/users/123/contribution/settings')
      .send({ contributionType: 'percentage', contributionValue: 150 });
    expect(response.body.error.code).toBe('INVALID_CONTRIBUTION_VALUE');
  });

  it('returns 400 for missing contributionType', async () => {
    await request(app)
      .put('/api/users/123/contribution/settings')
      .send({ contributionValue: 10 })
      .expect(400);
  });

  it('returns 400 for missing contributionValue', async () => {
    await request(app)
      .put('/api/users/123/contribution/settings')
      .send({ contributionType: 'percentage' })
      .expect(400);
  });

  it('returns 400 for invalid contributionType', async () => {
    await request(app)
      .put('/api/users/123/contribution/settings')
      .send({ contributionType: 'invalid', contributionValue: 10 })
      .expect(400);
  });
});

// --------------- GET /api/users/:userId/contribution/ytd tests ---------------

describe('GET /api/users/:userId/contribution/ytd', () => {
  it('returns 200 for valid user', async () => {
    await request(app)
      .get('/api/users/123/contribution/ytd')
      .expect(200);
  });

  it('returns ytdContributions property', async () => {
    const response = await request(app)
      .get('/api/users/123/contribution/ytd');
    expect(response.body).toHaveProperty('ytdContributions');
  });

  it('returns ytdPaychecks property', async () => {
    const response = await request(app)
      .get('/api/users/123/contribution/ytd');
    expect(response.body).toHaveProperty('ytdPaychecks');
  });

  it('returns currentYearStart property', async () => {
    const response = await request(app)
      .get('/api/users/123/contribution/ytd');
    expect(response.body).toHaveProperty('currentYearStart');
  });

  it('returns mockData property', async () => {
    const response = await request(app)
      .get('/api/users/123/contribution/ytd');
    expect(response.body).toHaveProperty('mockData');
  });

  it('returns correct ytdContributions for user 123', async () => {
    const response = await request(app)
      .get('/api/users/123/contribution/ytd');
    expect(response.body.ytdContributions).toBe(5000);
  });

  it('returns correct ytdPaychecks for user 123', async () => {
    const response = await request(app)
      .get('/api/users/123/contribution/ytd');
    expect(response.body.ytdPaychecks).toBe(24);
  });

  it('returns annualSalary in mockData', async () => {
    const response = await request(app)
      .get('/api/users/123/contribution/ytd');
    expect(response.body.mockData).toHaveProperty('annualSalary');
  });

  it('returns payFrequency in mockData', async () => {
    const response = await request(app)
      .get('/api/users/123/contribution/ytd');
    expect(response.body.mockData).toHaveProperty('payFrequency');
  });

  it('returns correct annualSalary for user 123', async () => {
    const response = await request(app)
      .get('/api/users/123/contribution/ytd');
    expect(response.body.mockData.annualSalary).toBe(60000);
  });

  it('returns correct payFrequency for user 123', async () => {
    const response = await request(app)
      .get('/api/users/123/contribution/ytd');
    expect(response.body.mockData.payFrequency).toBe('biweekly');
  });

  it('returns 404 for non-existent user', async () => {
    await request(app)
      .get('/api/users/999/contribution/ytd')
      .expect(404);
  });

  it('returns error object for non-existent user', async () => {
    const response = await request(app)
      .get('/api/users/999/contribution/ytd');
    expect(response.body).toHaveProperty('error');
  });

  it('returns USER_NOT_FOUND error code', async () => {
    const response = await request(app)
      .get('/api/users/999/contribution/ytd');
    expect(response.body.error.code).toBe('USER_NOT_FOUND');
  });

  it('returns 400 for invalid userId format', async () => {
    await request(app)
      .get('/api/users/abc/contribution/ytd')
      .expect(400);
  });
});