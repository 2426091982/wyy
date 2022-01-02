/* eslint-disable @typescript-eslint/no-explicit-any */
export type InferComment<T> = T extends [...args: infer Type]
    ? keyof Type[0] 
    :  T extends { [key: string]: any } 
        ? keyof T
        : never;
