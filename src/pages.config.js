/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Admin from './pages/Admin';
import Alerts from './pages/Alerts';
import AntiChargeback from './pages/AntiChargeback';
import Checkout from './pages/Checkout';
import ClownckerPlus from './pages/ClownckerPlus';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import HotOffers from './pages/HotOffers';
import OfferDetail from './pages/OfferDetail';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import OfertasDoDia from './pages/OfertasDoDia';
import CategoryTendencias from './pages/CategoryTendencias';
import CategoryLowTicket from './pages/CategoryLowTicket';
import CategoryRendaExtra from './pages/CategoryRendaExtra';
import CategorySaudeBemEstar from './pages/CategorySaudeBemEstar';
import CategoryEmagrecimento from './pages/CategoryEmagrecimento';
import CategoryFitnessExercicios from './pages/CategoryFitnessExercicios';
import CategoryRelacionamento from './pages/CategoryRelacionamento';
import CategorySexualidade from './pages/CategorySexualidade';
import CategoryFamiliaMaternidade from './pages/CategoryFamiliaMaternidade';
import CategoryEducacaoIdiomas from './pages/CategoryEducacaoIdiomas';
import CategoryDesenvolvPessoal from './pages/CategoryDesenvolvPessoal';
import CategoryEspiritualidade from './pages/CategoryEspiritualidade';
import CategoryModaBeleza from './pages/CategoryModaBeleza';
import CategoryEstiloVida from './pages/CategoryEstiloVida';
import CategoryPets from './pages/CategoryPets';


export const PAGES = {
    "Admin": Admin,
    "Alerts": Alerts,
    "AntiChargeback": AntiChargeback,
    "Checkout": Checkout,
    "ClownckerPlus": ClownckerPlus,
    "Dashboard": Dashboard,
    "Favorites": Favorites,
    "Home": Home,
    "HotOffers": HotOffers,
    "OfferDetail": OfferDetail,
    "Offers": Offers,
    "Profile": Profile,
    "OfertasDoDia": OfertasDoDia,
    "CategoryTendencias": CategoryTendencias,
    "CategoryLowTicket": CategoryLowTicket,
    "CategoryRendaExtra": CategoryRendaExtra,
    "CategorySaudeBemEstar": CategorySaudeBemEstar,
    "CategoryEmagrecimento": CategoryEmagrecimento,
    "CategoryFitnessExercicios": CategoryFitnessExercicios,
    "CategoryRelacionamento": CategoryRelacionamento,
    "CategorySexualidade": CategorySexualidade,
    "CategoryFamiliaMaternidade": CategoryFamiliaMaternidade,
    "CategoryEducacaoIdiomas": CategoryEducacaoIdiomas,
    "CategoryDesenvolvPessoal": CategoryDesenvolvPessoal,
    "CategoryEspiritualidade": CategoryEspiritualidade,
    "CategoryModaBeleza": CategoryModaBeleza,
    "CategoryEstiloVida": CategoryEstiloVida,
    "CategoryPets": CategoryPets,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};