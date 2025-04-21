export interface ProviderRepository {
  getIdByName(providerName: string): Promise<string>;
}
