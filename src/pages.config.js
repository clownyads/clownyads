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
import CategoryDesenvolvPessoal from './pages/CategoryDesenvolvPessoal';
import CategoryEducacaoIdiomas from './pages/CategoryEducacaoIdiomas';
import CategoryEmagrecimento from './pages/CategoryEmagrecimento';
import CategoryEspiritualidade from './pages/CategoryEspiritualidade';
import CategoryEstiloVida from './pages/CategoryEstiloVida';
import CategoryFamiliaMaternidade from './pages/CategoryFamiliaMaternidade';
import CategoryFitnessExercicios from './pages/CategoryFitnessExercicios';
import CategoryLowTicket from './pages/CategoryLowTicket';
import CategoryModaBeleza from './pages/CategoryModaBeleza';
import CategoryPets from './pages/CategoryPets';
import CategoryRelacionamento from './pages/CategoryRelacionamento';
import CategoryRendaExtra from './pages/CategoryRendaExtra';
import CategorySaudeBemEstar from './pages/CategorySaudeBemEstar';
import CategorySexualidade from './pages/CategorySexualidade';
import CategoryTendencias from './pages/CategoryTendencias';
import Checkout from './pages/Checkout';
import ClownadorPRO from './pages/ClownadorPRO';
import ClownckerPlus from './pages/ClownckerPlus';
import Comunidade from './pages/Comunidade';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import HotOffers from './pages/HotOffers';
import OfertasDoDia from './pages/OfertasDoDia';
import OfferDetail from './pages/OfferDetail';
import Offers from './pages/Offers';
import Profile from './pages/Profile';


export const PAGES = {
    "Admin": Admin,
    "Alerts": Alerts,
    "AntiChargeback": AntiChargeback,
    "CategoryDesenvolvPessoal": CategoryDesenvolvPessoal,
    "CategoryEducacaoIdiomas": CategoryEducacaoIdiomas,
    "CategoryEmagrecimento": CategoryEmagrecimento,
    "CategoryEspiritualidade": CategoryEspiritualidade,
    "CategoryEstiloVida": CategoryEstiloVida,
    "CategoryFamiliaMaternidade": CategoryFamiliaMaternidade,
    "CategoryFitnessExercicios": CategoryFitnessExercicios,
    "CategoryLowTicket": CategoryLowTicket,
    "CategoryModaBeleza": CategoryModaBeleza,
    "CategoryPets": CategoryPets,
    "CategoryRelacionamento": CategoryRelacionamento,
    "CategoryRendaExtra": CategoryRendaExtra,
    "CategorySaudeBemEstar": CategorySaudeBemEstar,
    "CategorySexualidade": CategorySexualidade,
    "CategoryTendencias": CategoryTendencias,
    "Checkout": Checkout,
    "ClownadorPRO": ClownadorPRO,
    "ClownckerPlus": ClownckerPlus,
    "Comunidade": Comunidade,
    "Favorites": Favorites,
    "Home": Home,
    "HotOffers": HotOffers,
    "OfertasDoDia": OfertasDoDia,
    "OfferDetail": OfferDetail,
    "Offers": Offers,
    "Profile": Profile,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};