import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Offers from './pages/Offers';
import HotOffers from './pages/HotOffers';
import Alerts from './pages/Alerts';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import OfferDetail from './pages/OfferDetail';
import Admin from './pages/Admin';


export const PAGES = {
    "Home": Home,
    "Dashboard": Dashboard,
    "Offers": Offers,
    "HotOffers": HotOffers,
    "Alerts": Alerts,
    "Favorites": Favorites,
    "Profile": Profile,
    "OfferDetail": OfferDetail,
    "Admin": Admin,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};