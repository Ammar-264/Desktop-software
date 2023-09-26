import "./App.css";
import { Bill } from "./Pages/Bills/bill";
import { Bills } from "./Pages/Bills/bills";
import { DailyWages } from "./Pages/DailyWages/DailyWages";
import { Wages } from "./Pages/DailyWages/Wages";
import { Challan } from "./Pages/DeliveryChallans/challan";
import { DeliveryChallans } from "./Pages/DeliveryChallans/deliveryChallans";
import { Ledgers } from "./Pages/PartyLedgers/ledgers";
import { Parties } from "./Pages/PartyLedgers/parties";
import { Voucher } from "./Pages/PaymentVouchers/Voucher";
import { PaymentVouchers } from "./Pages/PaymentVouchers/paymentVouchers";
import { Login } from "./Pages/authentication/login";
import "./style.css";
import "./style2.css";
import { BrowserRouter as Router, Routes, Route  , HashRouter} from "react-router-dom";
import { AllUsers } from "./Pages/authentication/allUsers";



function App() {



  return (
        <HashRouter basename="/">
     
          <Routes>

            <Route  path="/deliveryChallans" element={<DeliveryChallans />} />
            <Route path="/bills" element={<Bills />} />
            <Route path="/paymentVouchers" element={<PaymentVouchers />} />
            <Route path="/dailyWages" element={<DailyWages />} />
            <Route path="/" element={<Parties />} />
            <Route path="/bill/:id" element={<Bill />} />
            <Route path="/deliveryChallan/:id" element={<Challan />} />
            <Route path="/paymentVoucher/:id" element={<Voucher />} />
            <Route path="/wages/:id" element={<Wages />} />
            <Route path="/ledgers/:id" element={<Ledgers />} />
            <Route path="/login" element={<Login />} />
            <Route path="/users" element={<AllUsers />} />

          </Routes>
  
        </HashRouter>
  );
}

export default App;


