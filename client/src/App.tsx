import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ArticleListPage from './pages/ArticleListPage'
import ArticleDetailPage from './pages/ArticleDetailPage'
import CreateArticlePage from './pages/CreateArticlePage'
import EditArticlePage from './pages/EditArticlePage'

export default function App() {
  return (
    <BrowserRouter>
      <header className="site-header">
        <div className="container">
          <Link to="/" className="site-title">Articles</Link>
        </div>
      </header>
      <main className="main-content">
        <div className="container">
          <Routes>
            <Route path="/" element={<ArticleListPage />} />
            <Route path="/articles/new" element={<CreateArticlePage />} />
            <Route path="/articles/:articleId" element={<ArticleDetailPage />} />
            <Route path="/articles/:articleId/edit" element={<EditArticlePage />} />
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  )
}
