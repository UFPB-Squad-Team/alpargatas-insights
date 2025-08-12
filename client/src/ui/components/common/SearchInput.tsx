import { useClickOutside } from '@/ui/hooks/useClickOutside';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import RiskIndicator from './RiskIndicator';
import { searchSchoolsUseCase } from '@/shared/services/Schools/logic/searchSchoolsUseCase';
import { useDashboard } from '@/ui/context/DashboardContext';
import { useDebounce } from '@/ui/hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { School } from '@/domain/entities/SchoolProps';
import { useNavigate } from 'react-router-dom';

const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const containerRef = useClickOutside(() => setIsDropdownOpen(false));
  const { setSelectedSchoolId } = useDashboard();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: paginatedResult, isLoading } = useQuery({
    queryKey: ['search-schools', debouncedSearchTerm],
    queryFn: () => searchSchoolsUseCase.execute(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length >= 3,
  });

  const searchResults = paginatedResult?.data || [];

  useEffect(() => {
    if (searchResults.length > 0) {
      setIsDropdownOpen(true);
    }
  }, [searchResults]);

  const navigate = useNavigate();

  const handleSelectSchool = (school: School) => {
    setSelectedSchoolId(school.inep);
    navigate('/');
    setIsDropdownOpen(false);
  };

  return (
    <div
      className="relative hidden sm:flex flex-col bg-brand-surface rounded-md p-2 w-full max-w-md lg:max-w-xl xl:max-w-2xl"
      ref={containerRef}
    >
      <div className="flex items-center">
        <Search className="h-5 w-5 text-brand-text-secondary" />
        <input
          type="text"
          placeholder="Buscar escolas ou municípios..."
          className="bg-transparent ml-2 outline-none w-full text-brand-text-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (searchResults.length > 0) setIsDropdownOpen(true);
          }}
        />
      </div>

      {isDropdownOpen && debouncedSearchTerm.length >= 3 && (
        <div className="absolute top-full left-0 w-full bg-white border rounded-md shadow-lg mt-2 z-[9999] max-h-80  overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-gray-500">Buscando...</div>
          ) : searchResults.length > 0 ? (
            <ul>
              {searchResults.map((school) => (
                <li
                  key={school.inep}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b"
                  onClick={() => handleSelectSchool(school)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{school.nome}</p>
                      <p className="text-sm text-gray-500">
                        {school.municipio}
                      </p>
                    </div>
                    <RiskIndicator score={school.scoreDeRisco} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-gray-500">
              Nenhum resultado encontrado.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
