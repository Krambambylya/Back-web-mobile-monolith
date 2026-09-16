export type JsonKvStore = {
  getItem: (key: string) => Promise<string | null> | string | null;
  setItem: (key: string, value: string) => Promise<void> | void;
};

export const createMemoryKv = (): JsonKvStore => {
  const map = new Map<string, string>();
  return {
    getItem: key => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    },
  };
};

export const createJsonListStore = <T>(options: {
  key: string;
  kv: JsonKvStore;
  ignoreWriteErrors?: boolean;
}) => {
  let memory: T[] | null = null;

  const getAll = async (): Promise<T[]> => {
    if (memory) return memory;
    try {
      const raw = await options.kv.getItem(options.key);
      const parsed = raw ? (JSON.parse(raw) as unknown) : [];
      memory = Array.isArray(parsed) ? (parsed as T[]) : [];
      return memory;
    } catch {
      memory = [];
      return memory;
    }
  };

  const writeAll = async (items: T[]): Promise<void> => {
    memory = items;
    try {
      await options.kv.setItem(options.key, JSON.stringify(items));
    } catch (error) {
      if (!options.ignoreWriteErrors) throw error;
    }
  };

  return { getAll, writeAll };
};
