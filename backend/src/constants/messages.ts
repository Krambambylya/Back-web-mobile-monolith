export const SUCCESS = {
  OK: 'ok',
  WORKSPACE_CREATED: 'Workspace created',
  WORKSPACE_JOINED: 'Workspace joined',
  WORKSPACE_RECOVERED: 'Workspace recovered',
  REFRESH_SUCCESSFUL: 'Token refreshed successfully',
  PAIRING_CODE_ISSUED: 'Pairing code issued',
  ITEMS_LIST_OK: 'Items listed',
  ITEMS_UPSERT_OK: 'Item saved',
  ITEMS_BOOTSTRAP_OK: 'Items bootstrap chunk accepted',
  ITEMS_MANIFEST_OK: 'Items manifest diff ready',
  ITEMS_PULL_OK: 'Items pulled',
  ITEMS_PUSH_OK: 'Items pushed',
};

export const ERROR = {
  INTERNAL_SERVER_ERROR: 'Internal server error',
  BAD_REQUEST: 'Bad Request',
  ORIGIN_HEADER_IS_MISSING: 'Origin header is missing',
  ACCESS_FORBIDDEN: 'Access Forbidden',
  ROUTE_NOT_FOUND: 'Route not found or wrong API method',
  UNAUTHORIZED: 'Unauthorized',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  INVALID_PAIRING_CODE: 'Invalid or expired pairing code',
  INVALID_RECOVERY_KEY: 'Invalid recovery key',
  ITEM_LIMIT_EXCEEDED: 'Workspace item limit exceeded',
  DATABASE_UNAVAILABLE: 'database unavailable',
};
