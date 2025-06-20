import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate, useSearchParams  } from 'react-router-dom';
import Pagination from './Pagination';

const Container = styled.div`
  padding: 2rem;
  background-color: #111;
  color: #eee;
  min-height: 100vh;
  border-radius: 20px;
`;

const Title = styled.h1`
  color: #ffce54;
  margin-bottom: 2rem;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1.2rem;
`;

const Card = styled.div`
  background-color: #1e1e1e;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  text-align: center;
  transition: transform 0.2s ease, background-color 0.2s ease;
  height: 160px; 

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #292929;
    transform: translateY(-4px);
  }

  h4 {
    margin-top: 0.4rem;
    font-size: 0.85rem;
    color: #ffce54;
    word-break: break-word;
  }
`;

const PlaceholderAvatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: #444;
  margin: 0 auto 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #ccc;
  font-size: 0.9rem;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 0.6rem 1rem;
  margin: 0 auto 2rem;
  display: block;
  background-color: #1a1a1a;
  color: #eee;
  border: 1px solid #444;
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #ffce54;
  }
`;

const SkeletonSearchInput = styled.div`
  width: 100%;
  max-width: 400px;
  height: 42px;
  margin: 0 auto 2rem;
  border-radius: 8px;
  background-color: #2a2a2a;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      background-color: #2a2a2a;
    }
    50% {
      background-color: #3a3a3a;
    }
    100% {
      background-color: #2a2a2a;
    }
  }
`;

const AvatarWrapper = styled.div`
  margin-bottom: 0.4rem;
`;


const Grandmasters = () => {
  const [gms, setGMs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 25;
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchGMs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_CHESS_API_BASE}/titled/GM`);

        const sorted = response.data.players.sort((a: string, b: string) => {
        const aIsNum = /^\d/.test(a);
        const bIsNum = /^\d/.test(b);

        if (aIsNum && !bIsNum) return 1;
        if (!aIsNum && bIsNum) return -1;
        return a.localeCompare(b);
      });

      setGMs(sorted);
      } catch (error) {
        console.error('Failed to fetch GMs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGMs();
  }, []);

  const filteredGMs = gms.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredGMs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredGMs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleClick = (username: string) => {
    navigate(`/player/${username}?page=${currentPage}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
  };
  return (
    <Container>
      <Title>♟️ Grandmasters</Title>
      {loading ? (
        <SkeletonSearchInput />
      ) : (
        <SearchInput
          type="text"
          placeholder="Search grandmaster..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      )}
      {loading ? (
      <Grid>
        {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
          <Card key={i} style={{ backgroundColor: '#2a2a2a', animation: 'pulse 1.5s infinite' }}>
            <PlaceholderAvatar style={{ backgroundColor: '#555' }} />
            <h4 style={{ backgroundColor: '#333', width: '60%', height: '1rem', margin: '0.6rem auto 0', borderRadius: '4px' }} />
          </Card>
        ))}
      </Grid>
    ) : (
      <>
        <Grid>
          {currentItems.map((gm) => (
            <Card key={gm} onClick={() => handleClick(gm)}>
              <AvatarWrapper>
                <PlaceholderAvatar>{gm[0].toUpperCase()}</PlaceholderAvatar>
              </AvatarWrapper>
              <h4>{gm}</h4>
            </Card>
          ))}
        </Grid>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </>
    )}
    </Container>
  );
};

export default Grandmasters;
