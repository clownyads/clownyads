import Admin from './pages/Admin';
import Alerts from './pages/Alerts';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import HotOffers from './pages/HotOffers';
import OfferDetail from './pages/OfferDetail';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import ClownckerPlus from './pages/ClownckerPlus';
import AntiChargeback from './pages/AntiChargeback';


export const PAGES = {
    "Admin": Admin,
    "Alerts": Alerts,
    "Dashboard": Dashboard,
    "Favorites": Favorites,
    "Home": Home,
    "HotOffers": HotOffers,
    "OfferDetail": OfferDetail,
    "Offers": Offers,
    "Profile": Profile,
    "Checkout": Checkout,
    "ClownckerPlus": ClownckerPlus,
    "AntiChargeback": AntiChargeback,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};