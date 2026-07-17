import Settings from './settings.model.js';
import { DEFAULT_PRICES } from '../../shared/constants.js';
import { PriceTiers, ISettingsResponse } from './settings.types.js';

let cachedPrices: PriceTiers | null = null;

export async function getPrices(): Promise<PriceTiers> {
  if (cachedPrices) return cachedPrices;

  const settings = await Settings.findOne();
  cachedPrices = (settings?.prices as PriceTiers | undefined) ?? DEFAULT_PRICES;
  return cachedPrices;
}

export async function updatePrices(prices: PriceTiers): Promise<ISettingsResponse> {
  const settings = await Settings.findOneAndUpdate(
    {},
    { prices },
    { upsert: true, new: true, runValidators: true }
  );

  cachedPrices = { ...settings.prices };

  return { prices: settings.prices };
}

export function invalidatePricesCache(): void {
  cachedPrices = null;
}
