import { HashRouter, Route, Routes } from 'react-router';
import { AppShell } from './ui/layouts/AppShell.tsx';
import { ExplorePage } from './ui/pages/ExplorePage.tsx';
import { HomePage } from './ui/pages/HomePage.tsx';
import { LegacyCategoryRedirect } from './ui/pages/LegacyCategoryRedirect.tsx';
import { NotFoundPage } from './ui/pages/NotFoundPage.tsx';

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="explore" element={<ExplorePage />}>
            <Route index element={null} />
            <Route path=":categorySlug" element={null} />
          </Route>
          <Route path=":categorySlug" element={<LegacyCategoryRedirect />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
