const BATCH_SIZE = 8;

export async function runInBatches<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  onResult: (item: T, result: R) => void
) {
  const batchSize = BATCH_SIZE;
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(fn));
    for (let j = 0; j < batch.length; j++) {
      onResult(batch[j]!, results[j]!);
    }
  }
}
