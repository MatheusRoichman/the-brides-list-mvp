export interface SiteContent {
  id: string;
  coupleName: string;
  eventLogoUrl: string;
  heroDescription: string;
  eventTimestamp: Date;
  eventAddressPrimaryLine: string;
  eventAddressSecondaryLine: string;
  suggestionsTitle: string;
  suggestionsText: string;
  showPrices: boolean;
  footerTitle: string;
  footerText: string;
  createdAt?: Date;
  updatedAt?: Date | null;
}
