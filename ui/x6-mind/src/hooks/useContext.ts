import { inject, provide, type InjectionKey } from "vue";

export function useContext<T>(key: InjectionKey<T> = Symbol()) {
  const useProvide = (context: T) => {
    provide(key, context);
    return context;
  };

  const useInject = () => {
    return inject(key) as T;
  };

  return {
    useProvide,
    useInject,
  };
}
