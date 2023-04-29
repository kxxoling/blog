export function serializeDatetime(datetime?: string | Date) {
  if (!datetime) {
    return null
  }
  if (datetime) {
    if (typeof datetime === 'string') {
      return new Date(datetime).toISOString()
    } else if (datetime instanceof Date) {
      return datetime.toISOString()
    }
  }
}
