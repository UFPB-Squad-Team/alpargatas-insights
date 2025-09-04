import { IMunicipalityRepository } from '../../../../domain/repositories/municipalityRepository';

export class ListMunicipalitiesUseCase {
  constructor(private municipalityRepository: IMunicipalityRepository) {}

  async execute(page: number, limit: number = 20, term?: string) {
    const municipality = await this.municipalityRepository.findAllForDropdown(
      page,
      limit,
      term
    );
    
    return municipality || [];
  }
}
