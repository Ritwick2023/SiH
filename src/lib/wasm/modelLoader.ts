/**
 * src/lib/wasm/modelLoader.ts
 *
 * Manages one-time download, local browser CacheStorage / IndexedDB caching,
 * and initialization of the quantized all-MiniLM-L6-v2 ONNX model.
 * Safe for isomorphic execution (SSR / Node.js guarded).
 */

let pipelinePromise: Promise<unknown> | null = null;

export interface ModelLoadStatus {
  loaded: boolean;
  modelName: string;
  source: 'cache' | 'network' | 'fallback' | 'unsupported';
  error?: string;
}

/**
 * Initializes the client-side feature extraction pipeline via @xenova/transformers.
 * Configured to use CacheStorage to prevent re-downloading the 23MB quantized ONNX model.
 */
export async function getEmbeddingPipeline(): Promise<unknown | null> {
  if (typeof window === 'undefined' || process.env.NODE_ENV === 'test') {
    return null;
  }

  if (pipelinePromise) {
    return pipelinePromise;
  }

  pipelinePromise = (async () => {
    try {
      const { pipeline, env } = await import('@xenova/transformers');

      // Configure local caching in browser if CacheStorage is available
      env.allowLocalModels = false;
      env.useBrowserCache = typeof window !== 'undefined' && typeof caches !== 'undefined';

      // Disable multi-threading or SIMD warnings if not supported in mobile browser
      if (env.backends?.onnx?.wasm) {
        env.backends.onnx.wasm.numThreads = 1;
      }

      const pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
        quantized: true,
      });

      return pipe;
    } catch (err) {
      console.warn('[StatVidya WASM] ONNX runtime initialization deferred, using lexical engine:', err);
      pipelinePromise = null;
      return null;
    }
  })();

  return pipelinePromise;
}

/**
 * Returns current status of local ONNX model cache
 */
export async function checkModelStatus(): Promise<ModelLoadStatus> {
  if (typeof window === 'undefined') {
    return {
      loaded: false,
      modelName: 'Xenova/all-MiniLM-L6-v2',
      source: 'fallback',
    };
  }

  try {
    const pipe = await getEmbeddingPipeline();
    return {
      loaded: Boolean(pipe),
      modelName: 'Xenova/all-MiniLM-L6-v2',
      source: pipe ? 'cache' : 'fallback',
    };
  } catch (err) {
    return {
      loaded: false,
      modelName: 'Xenova/all-MiniLM-L6-v2',
      source: 'fallback',
      error: (err as Error).message,
    };
  }
}
