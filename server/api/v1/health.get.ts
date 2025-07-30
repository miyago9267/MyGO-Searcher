import { defineEventHandler } from 'h3';

/**
 * GET /api/v1/health
 * 健康檢查端點
 */
export default defineEventHandler((_event) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'MyGO Searcher API',
    version: '1.0.0'
  };
});
