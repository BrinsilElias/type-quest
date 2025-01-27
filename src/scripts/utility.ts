function fmtTimeInterval(
  seconds: number,
  format: 'MM:SS' | 'Xm Ys' = 'MM:SS',
): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (format === 'Xm Ys') {
    return `${mins}m ${secs}s`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export { fmtTimeInterval };
