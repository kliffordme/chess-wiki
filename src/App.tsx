import { Routes, Route } from 'react-router-dom';
import Grandmasters from './components/Grandmasters';
import PlayerProfile from './pages/PlayerProfile';
import { GlobalStyle } from './styles/GlobalStyles';

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Grandmasters />} />
        <Route path="/player/:username" element={<PlayerProfile />} />
      </Routes>
    </>

  );
}

export default App;

