import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import type { ChessPlayer } from '../types/chess.d';
import { useLocation } from 'react-router-dom';

const Container = styled.div`
  width: 100%;
  min-height: 70vh;
  color: #eee;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
`;

const Card = styled.div`
  background-color: #1a1a1a;
  padding: 2rem;
  border-radius: 12px;
  max-width: 900px;
  width: 100%;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.8);
  text-align: left;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 2rem;
`;


const Avatar = styled.img`
  width: 160px;
  height: 160px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #ffce54;
`;

const UsernameBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start; 
`;


const Username = styled.h2`
  margin: 0;
  font-size: 2rem;
  color: #ffce54;
`;

const TitleBadge = styled.span`
  display: inline-block;
  background-color: #ffce54;
  color: #111;
  font-weight: bold;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  margin-top: 0.5rem;
`;

const Section = styled.div`
  margin-top: 2rem;
`;

const SectionTitle = styled.h3`
  border-bottom: 1px solid #444;
  padding-bottom: 0.4rem;
  margin-bottom: 1rem;
  color: #ffce54;
`;

const InfoList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const InfoItem = styled.div`
  font-size: 0.95rem;
  display: flex;

  strong {
    color: #ccc;
    min-width: 120px;
    display: inline-block;
  }
`;

const BackButton = styled.button`
  margin-top: 2rem;
  padding: 0.6rem 1.4rem;
  background-color: #ffce54;
  color: #111;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: #e6b84a;
  }
`;

const CenteredSectionContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
`;


const PlayerProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<ChessPlayer | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [timeSinceLastOnline, setTimeSinceLastOnline] = useState<number | null>(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pageParam = searchParams.get('page');

  useEffect(() => {
  let interval: ReturnType<typeof setInterval>;

  if (profile?.last_online) {
    const updateTimer = () => {
      const diff = Math.floor(Date.now() / 1000) - profile.last_online!;
      setTimeSinceLastOnline(diff);
    };

    updateTimer(); // Initial call
    interval = setInterval(updateTimer, 1000); // Update every second
  }

  return () => clearInterval(interval);
}, [profile?.last_online]);

const formatTime = (seconds: number) => {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
};



  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_CHESS_API_BASE}/player/${username}`);
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) return <Container><p>Loading...</p></Container>;
  if (!profile) return <Container><p>Player not found.</p></Container>;

  return (
    <Container>
      <Card>
        <Header>
          <Avatar
            src={profile.avatar || 'https://www.chess.com/bundles/web/images/user-image.007dad08.svg'}
            alt="avatar"
          />
          <UsernameBlock>
            <Username>{profile.username}</Username>
            {profile.title && <TitleBadge>{profile.title}</TitleBadge>}
          </UsernameBlock>
        </Header>

        <Section>
          <SectionTitle style={{ textAlign: 'center' }}>Player Info</SectionTitle>
          <InfoList>
            <InfoItem><strong>Name:</strong> {profile.name || 'N/A'}</InfoItem>
            <InfoItem><strong>Country:</strong> {profile.country?.split('/').pop()}</InfoItem>
            <InfoItem><strong>Status:</strong> {profile.status}</InfoItem>
            <InfoItem><strong>League:</strong> {profile.league || 'N/A'}</InfoItem>
          </InfoList>
        </Section>

        <Section>
          <SectionTitle style={{ textAlign: 'center' }}>Activity</SectionTitle>
          <InfoList>
            <InfoItem><strong>Joined:</strong> {profile.joined ? new Date(profile.joined * 1000).toLocaleDateString() : 'N/A'}</InfoItem>
            <InfoItem>
              <strong>Last Online:</strong>
              {profile.last_online
                ? `${new Date(profile.last_online * 1000).toLocaleString()} (${formatTime(timeSinceLastOnline ?? 0)} ago)`
                : 'N/A'}
            </InfoItem>
            <InfoItem><strong>Followers:</strong> {profile.followers}</InfoItem>
            <InfoItem><strong>Streamer:</strong> {profile.is_streamer ? 'Yes' : 'No'}</InfoItem>
            <InfoItem><strong>Verified:</strong> {profile.verified ? 'Yes' : 'No'}</InfoItem>
            <InfoItem>
              <strong>URL:</strong>{' '}
              {profile.url ? (
                <a
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#ffce54', textDecoration: 'underline' }}
                >
                  {profile.url}
                </a>
              ) : (
                'N/A'
              )}
            </InfoItem>
          </InfoList>
        </Section>
        <CenteredSectionContent>
          <BackButton onClick={() => navigate(`/?page=${pageParam}`)}>← Back</BackButton>
        </CenteredSectionContent>
      </Card>
    </Container>
  );
};

export default PlayerProfile;
