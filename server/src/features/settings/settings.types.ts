export interface PriceTiers {
  mayor: number;
  detal: number;
}

export interface ISettingsResponse {
  prices: PriceTiers;
}
