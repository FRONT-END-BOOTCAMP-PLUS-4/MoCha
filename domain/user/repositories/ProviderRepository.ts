export interface ProviderRepository {
  getIdByName(providerName: string): Promise<number>;
}
