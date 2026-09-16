/** HTTP envelope around a payload: `{ success, message, data? }`. Do not merge with `data`. */
export type ApiEnvelope<TData = unknown> = {
  success: boolean;
  message: string;
  data?: TData;
};

export function unwrapEnvelope<TData>(
  envelope: ApiEnvelope<TData>,
  fallbackMessage = 'Request failed',
): TData {
  if (!envelope.success || envelope.data === undefined) {
    throw new Error(envelope.message || fallbackMessage);
  }
  return envelope.data;
}
