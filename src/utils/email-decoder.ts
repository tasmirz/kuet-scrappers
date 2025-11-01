export function email_decoder(
  encoded: string,
  expectedEmail?: string
): { decoded: string; matches: boolean } | string {
  if (typeof encoded !== 'string' || encoded.length === 0) {
    return ''
    //throw new TypeError('encoded must be a non-empty string')
  }
  const hashIndex = encoded.indexOf('#')
  const hex = hashIndex >= 0 ? encoded.slice(hashIndex + 1) : encoded
  const cleaned = hex.replace(/[^0-9a-fA-F]/g, '')
  if (cleaned.length < 2 || cleaned.length % 2 !== 0) {
    throw new Error('encoded string is not valid hex or is too short')
  }
  const key = parseInt(cleaned.slice(0, 2), 16)
  const bytes = []
  for (let i = 2; i < cleaned.length; i += 2) {
    const val = parseInt(cleaned.slice(i, i + 2), 16) ^ key
    bytes.push(val)
  }
  let decoded
  try {
    decoded = new TextDecoder('utf-8').decode(new Uint8Array(bytes))
  } catch (err) {
    decoded = String.fromCharCode(...bytes)
  }
  if (typeof expectedEmail === 'undefined') {
    return decoded
  }
  return {
    decoded,
    matches: decoded === expectedEmail,
  }
}
