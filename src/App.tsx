import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages";
import UpcomingPage from "@/pages/upcoming";
import TrendingPage from "./pages/trending";
import AboutPage from "./pages/about";
import ShowDetails from "./pages/ShowDetails";
import SearchPage from "./pages/SearchPage";


function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<TrendingPage />} path="/trending" />
      <Route element={<UpcomingPage />} path="/upcoming" />
      <Route element={<AboutPage />} path="/about" />
      <Route path="/show/:id"  element={<ShowDetails type="tv" />} />
      <Route path="/movie/:id" element={<ShowDetails type="movie" />} />   
      <Route path="/search" element={<SearchPage />} />


      </Routes>

  );
}

export default App;
