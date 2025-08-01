import { GetSchoolsByDependenciaAdministrativa } from "../../../application/UseCases/SchoolUseCases/GetSchoolsByDependenciaAdmnistrativaUseCase/GetSchoolsByDependenciaAdministrativaUseCase"
import { dependenciaAdministrativa } from "../../../domain/enums/enumDependenciaAdministrativa"

describe("GetSchoolsByDependenciaAdministrativaUseCase", () => {
    it("Get school without errors", async () => {

     const mockSchoolRepository = {
            findById: jest.fn().mockResolvedValue(null),
            findByName: jest.fn().mockResolvedValue(null),
            findByUf: jest.fn().mockResolvedValue(null),
            findByDepAdm: jest.fn().mockResolvedValue([{
                dependenciaAdministrativa: 'estadual' 
            }]),
            findAllForMap: jest.fn().mockResolvedValue(null),
            findAll: jest.fn().mockResolvedValue(null),
            delete: jest.fn(),
            update: jest.fn(),
            save: jest.fn()
        }


        const getSchoolsByDependenciaAdministrativaUseCase = new GetSchoolsByDependenciaAdministrativa(mockSchoolRepository)

        const schoolData = {
            dependenciaAdministrativa: dependenciaAdministrativa.ESTADUAL
        }

        expect(await getSchoolsByDependenciaAdministrativaUseCase.execute(schoolData)).toEqual([schoolData])

        expect(mockSchoolRepository.findByDepAdm).toHaveBeenCalledWith("estadual")
    })

    it("Get a empty array", async() => {
        const mockSchoolRepository = {
            findById: jest.fn().mockResolvedValue(null),
            findByName: jest.fn().mockResolvedValue(null),
            findByUf: jest.fn().mockResolvedValue(null),
            findByDepAdm: jest.fn().mockResolvedValue(null),
            findAllForMap: jest.fn().mockResolvedValue(null),
            findAll: jest.fn().mockResolvedValue(null),
            delete: jest.fn(),
            update: jest.fn(),
            save: jest.fn()
        }

        const getSchoolsByDependenciaAdministrativaUseCase = new GetSchoolsByDependenciaAdministrativa(mockSchoolRepository)

        
        const schoolData = {
            dependenciaAdministrativa: dependenciaAdministrativa.ESTADUAL
        }

        expect(await getSchoolsByDependenciaAdministrativaUseCase.execute(schoolData)).toEqual([])

    })
})