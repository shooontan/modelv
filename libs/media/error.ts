type ErrorType =
  | 'NotFoundError'
  | 'NotReadableError'
  | 'NotAllowedError'
  | 'Error';

export function mediaStreamErrorType(error: Error): ErrorType {
  if (!(error instanceof DOMException)) {
    return 'Error';
  }

  // device is missing
  if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
    return 'NotFoundError';
  }

  // device is already in use
  if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
    return 'NotReadableError';
  }

  // permission denied
  if (
    error.name === 'NotAllowedError' ||
    error.name === 'PermissionDeniedError'
  ) {
    return 'NotAllowedError';
  }

  return 'Error';
}
