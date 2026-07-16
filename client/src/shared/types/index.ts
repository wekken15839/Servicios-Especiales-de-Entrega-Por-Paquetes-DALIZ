export type Nullable<T> = T | null

export type AsyncState<T> = {
  data: T
  isLoading: boolean
  error: string | null
}
