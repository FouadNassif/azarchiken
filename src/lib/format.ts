export function formatPrice(value: number): string {
  return `${new Intl.NumberFormat("en-US").format(Math.round(value))} LL`;
}
