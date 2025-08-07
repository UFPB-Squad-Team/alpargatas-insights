import { GetSchoolDetailsUseCase } from '../../../application/UseCases/SchoolUseCases/GetSchoolDetailsUseCase/GetSchoolDetailsUseCase';
import { HTTPSTATUS } from '../../../shared/config/http';

describe('GetSchoolDetailsUseCase', () => {
  it('Get schools without errors', async () => {
    const mockSchoolRepository = {
      findById: jest.fn().mockResolvedValue({
        id: '1',
      }),
      findByIbgeCode: jest.fn().mockResolvedValue(null),
      findByName: jest.fn().mockResolvedValue(null),
      findByUf: jest.fn().mockResolvedValue(null),
      findByDepAdm: jest.fn().mockResolvedValue(null),
      findSearchByTerm: jest.fn().mockResolvedValue(null),
      findAllForMap: jest.fn().mockResolvedValue(null),
      findAll: jest.fn().mockResolvedValue(null),
      delete: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
    };

    const getSchoolDetailsUseCase = new GetSchoolDetailsUseCase(
      mockSchoolRepository,
    );

    const schoolData = {
      id: '1',
    };

    expect(await getSchoolDetailsUseCase.execute(schoolData)).toEqual(
      schoolData,
    );

    expect(mockSchoolRepository.findById).toHaveBeenCalledWith('1');
  });

  it('Get school with not found error', async () => {
    const mockSchoolRepository = {
      findById: jest.fn().mockResolvedValue(null),
      findByIbgeCode: jest.fn().mockResolvedValue(null),
      findByName: jest.fn().mockResolvedValue(null),
      findByUf: jest.fn().mockResolvedValue(null),
      findByDepAdm: jest.fn().mockResolvedValue(null),
      findSearchByTerm: jest.fn().mockResolvedValue(null),
      findAllForMap: jest.fn().mockResolvedValue(null),
      findAll: jest.fn().mockResolvedValue(null),
      delete: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
    };

    const getSchoolDetailsUseCase = new GetSchoolDetailsUseCase(
      mockSchoolRepository,
    );

    const schoolData = {
      id: '1',
    };

    await expect(
      getSchoolDetailsUseCase.execute(schoolData),
    ).rejects.toMatchObject({
      message: 'School not found',
      statusCode: HTTPSTATUS.NOT_FOUND,
    });
  });
});
