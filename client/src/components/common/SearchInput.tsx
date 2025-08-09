import { useClickOutside } from '@/hooks/useClickOutside';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { SchoolProps } from '@/domain/entities/School';
import RiskIndicator from './RiskIndicator';
import { searchSchools } from '@/mocks/services/searchSchools';

const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SchoolProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const containerRef = useClickOutside(() => setIsDropdownOpen(false));

  useEffect(() => {
    if (searchTerm.length < 3) {
      setSearchResults([]);
      setIsDropdownOpen(false);
      return;
    }

    const debounce = setTimeout(async () => {
      setIsLoading(true);
      try {
        let results = await searchSchools(searchTerm);

        results = results.sort((a, b) => b.score_de_risco - a.score_de_risco);

        setSearchResults(results);
        setIsDropdownOpen(true);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm, setSearchResults]);

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

      {isDropdownOpen && (
        <div className="absolute top-full left-0 w-full bg-white border rounded-md shadow-lg mt-2 z-[9999] max-h-80  overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-gray-500">Buscando...</div>
          ) : searchResults.length > 0 ? (
            <ul>
              {searchResults.map((school) => (
                <li
                  key={school.escola_id_inep}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{school.escola_nome}</p>
                      <p className="text-sm text-gray-500">
                        {school.municipio_nome}
                      </p>
                    </div>
                    <RiskIndicator score={school.score_de_risco} />
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
