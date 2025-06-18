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
`;

const Title = styled.h2`
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

  &:hover {
    background-color: #292929;
    transform: translateY(-4px);
  }

  h4 {
    margin: 0.6rem 0 0;
    font-size: 1rem;
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

const Grandmasters = () => {
  const [gms, setGMs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 25;
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGMs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_CHESS_API_BASE}/titled/GM`);
        setGMs(response.data.players);
      } catch (error) {
        console.error('Failed to fetch GMs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGMs();
  }, []);

  const totalPages = Math.ceil(gms.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = gms.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleClick = (username: string) => {
    navigate(`/player/${username}?page=${currentPage}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
  };
  return (
    <Container>
      <Title>♟️ List of Grandmasters</Title>
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
              <PlaceholderAvatar>{gm[0].toUpperCase()}</PlaceholderAvatar>
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
