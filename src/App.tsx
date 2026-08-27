import { Routes, Route } from 'react-router';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Map } from './pages/Map';
import { Forecast } from './pages/Forecast';
import { Alerts } from './pages/Alerts';
import { About } from './pages/About';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <h2 className="text-6xl font-black text-emergency mb-4">404</h2>
    <p className="text-medium-emphasis text-lg">Šī lapa nav atrasta.</p>
  </div>
);

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/karte" element={<Map />} />
        <Route path="/prognoze" element={<Forecast />} />
        <Route path="/bridinajumi" element={<Alerts />} />
        <Route path="/blogs" element={<Blog />} />
        <Route path="/blogs/:slug" element={<BlogPost />} />
        <Route path="/par" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;