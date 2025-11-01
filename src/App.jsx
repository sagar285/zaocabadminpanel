import React from "react";
import Signup from "./Admin/pages/Signup";
import DriverTravels from "./Admin/pages/DriverTravels";
import { Routes, Route, useParams } from "react-router-dom";
import ViewDriver from "./Admin/pages/ViewDriver";
import ViewTravel from "./Admin/pages/ViewTravel";
import FareManagementScreen from "./Admin/pages/FareMangment";
import StateCity from "./Admin/pages/StateCity";
import CitiesPage from "./Admin/pages/CityPage";
import Category from "./Admin/pages/Category";
import SubCategory from "./Admin/pages/SubCategory";
import AdminTrips from "./Admin/pages/AdminTrips";
import NoFound from "./Admin/pages/NoFound";
import ViewTrip from "./Admin/pages/ViewTrip";
import AddDriver from "./Admin/pages/AddDriver";
import AddTravelOwner from "./Admin/pages/AddTravelOwner";
import { Provider } from "./Admin/Component/Context/Provider";
import UserTrips from "./Admin/pages/UserTrips";
import ViewUserTrip from "./Admin/pages/ViewUserTrip";
import TripStates from "./Admin/pages/TripActiveStates/TripStates";
import Wallet from "./Admin/pages/Wallet";
import Transaction from "./Admin/pages/Transaction";
import EditFareManagementScreen from "./Admin/pages/EditFareManagment";
import VehiclePage from "./Admin/pages/VehiclePage";
import Dashboard from "./Admin/pages/Dashboard";
import UserWaletInfo from "./Admin/pages/UserWaletInfo";
import Notification from "./Admin/pages/Notification";
import Feedback from "./Admin/pages/Feedback";
import ShowTripByStatus from "./Admin/pages/ShowTripByStatus";
import SelectPercentage from "./Admin/pages/SelectPercentage";
import CarpoolPage from "./Admin/Component/Carpool/CarpoolPage";
import BrandManagement from "./Admin/Component/Carpool/BrandManagement.jsx";
import VehicleNameManagement from "./Admin/Component/Carpool/VehicleNameManagement";
import ManageVehicleSeats from "./Admin/Component/Carpool/ManageVechileSeats.jsx";
import AddSeat from "./Admin/Component/Carpool/AddSeat.jsx";
import CreditTransaction from "./Admin/pages/transaction/CreditTransaction.jsx";
import DebitTransactions from "./Admin/pages/transaction/DebitTransactions.jsx";
import PercentageTransactions from "./Admin/pages/transaction/PercentageTransaction.jsx";
import CreditTransactions from "./Admin/pages/transaction/CreditTransaction.jsx";
import VechileCategory from "./Admin/pages/VechileCategory.jsx";
import CarpoolAwareness from "./Admin/Component/Carpool/CarpoolAwarness.jsx";
import ZaoCabSupport from "./Admin/pages/Support.jsx";
import TripDetails from "./Admin/pages/TripActiveStates/TripDetails.jsx";
import CarpoolOffer from "./Admin/Component/Carpool/CarpoolOffer.jsx";
import DriverReview from "./Admin/Component/Driver/DriverReview.jsx";
import DriverCancel from "./Admin/Component/Driver/DriverCancel.jsx";
import FareList from "./Admin/pages/FareList.jsx";
import TravelPartner from "./Admin/Component/Travel/TravelPartner.jsx";
import PerKmFareManagement from "./Admin/pages/PerKmFareManagement.jsx";
import FuelManagement from "./Admin/Component/Carpool/FuelManagement.jsx";
import ColorManagement from "./Admin/Component/Carpool/ColorManagement.jsx";
import FuelManag from "./Admin/Component/Carpool/FuelManag.jsx";
import YearManagement from "./Admin/Component/Carpool/YearManagement.jsx";
import AvailableSeates from "./Admin/Component/Carpool/AvailableSeats.jsx";
import AvailableSeatDetails from "./Admin/Component/Carpool/AvailableSeatDetails.jsx";
import AddCarpoolvechile from "./Admin/Component/Carpool/AddCarpoolvechile.jsx";
import AddCategoryVehicle from "./Admin/pages/AddCategoryVechile.jsx";
import Passenger from "./Admin/Component/Passenger/Passenger.jsx";
import ViewPassenger from "./Admin/Component/Passenger/ViewPassenger.jsx";
import OtherCategory from "./Admin/Component/Other/OtherCategory.jsx";
import OtherServices from "./Admin/Component/Other/OtherService.jsx";
import ViewAsPage from "./Admin/pages/CategoryViewAs.jsx";
import ReportPage from "./Admin/Component/Report/ReportPage.jsx";
import ReportDetailPage from "./Admin/Component/Report/ReportDetail.jsx";
import AddReportReason from "./Admin/Component/Report/AddReportReason.jsx";
import ReportOptionListPage from "./Admin/Component/Report/ReportOptionList.jsx";
import ReportManagementSystem from "./Admin/Component/Report/AddReportReason.jsx";
import MembershipList from "./Admin/Component/Passenger/MembershipList.jsx";
import FollowersList from "./Admin/Component/Passenger/FollowersList.jsx";
import FollowingList from "./Admin/Component/Passenger/FollowingList.jsx";
import EditSeat from "./Admin/Component/Carpool/EditSeat.jsx";
import EditFareManagementScree2 from "./Admin/pages/EditFare.jsx";
import OneWayTripsVehicle from "./Admin/pages/OnewayTripsVehicle.jsx";
import CarpoolTripsVehicle from "./Admin/pages/CarpoolTripsVehicle.jsx";
import ViewUserCarpoolTrip from "./Admin/pages/ViewuserCarpoolTrip.jsx";
import Packages from "./Admin/pages/Packages.jsx";
import SubscriptionPackages from "./Admin/pages/SubscriptionPackages.jsx";
import PerKmFareManagementScreen from "./Admin/pages/EditPerkmFareManagmentScreen.jsx";
import AlertTrip from "./Admin/pages/AlertTrip.jsx";
import Travels from "./Admin/pages/Travels.jsx";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/trips/:status" element={<ShowTripByStatus />} />
      <Route path="/trips/AlertTrip" element={<AlertTrip />} />
      <Route path="/addFare" element={<FareManagementScreen />} />
      <Route path="/editFareManagment/:id" element={<EditFareManagementScree2 />} />
      <Route path="/addFare/perkm" element={<PerKmFareManagement />} />
      <Route path="/faretrip/perkm/:id" element={<PerKmFareManagementScreen />} />
      <Route path="/subcription-packages" element={<SubscriptionPackages />} />

      <Route
        path="/drivers"
        element={
          <Provider>
            <DriverTravels />
          </Provider>
        }
      />
      <Route
        path="/travels"
        element={
          <Provider>
            <Travels  />
          </Provider>
        }
      />
      <Route
        path="/add-driver"
        element={
          <Provider>
            <AddDriver />
          </Provider>
        }
      />
      <Route
        path="/add-travel-owner"
        element={
          <Provider>
            <AddTravelOwner />
          </Provider>
        }
      />
      <Route path="/carpool" element={<CarpoolPage />} />
      <Route path="/passenger-travels" element={<Passenger />} />

      <Route path="/passenger-travels/:id" element={<ViewPassenger />} />
      <Route path="/passenger/membership-list" element={<MembershipList />} />
      <Route path="/passenger/followers-list" element={<FollowersList />} />
       <Route path="/passenger/following-list" element={<FollowingList />} />


      <Route path="/carpool/add-fuel" element={<FuelManagement />} />
      <Route path="/add-fuel" element={<FuelManagement />} />

      <Route path="/carpool/add-year" element={<YearManagement />} />
      <Route path="/add-year" element={<YearManagement />} />

      <Route path="/carpool/color" element={<ColorManagement />} />
      <Route path="/color" element={<ColorManagement />} />
      <Route path="/packages" element={<Packages />} />

      <Route path="/driver/:id" element={<ViewDriver />} />
      <Route path="/report-reason/" element={<AddReportReason />} />
      <Route path="/report-reason/:id" element={<ReportOptionListPage />} />

      <Route path="/report-list" element={<ReportPage />} />
      <Route path="/report-list/:id" element={<ReportDetailPage />} />

      <Route path="/feedback" element={<Feedback />} />
      <Route path="/userWalletInfo/:id" element={<UserWaletInfo />} />
      <Route path="/travel/:id" element={<ViewTravel />} />
      <Route path="/stateCity" element={<StateCity />} />
      <Route path="/state/:stateName" element={<CitiesPage />} />
      <Route path="/category" element={<Category />} />
      <Route path="/percentagecut" element={<SelectPercentage />} />
      <Route path="/userTrips" element={<UserTrips />} />
      <Route path="/trips" element={<AdminTrips />} />
      <Route path="/notifications" element={<Notification />} />
      <Route path="/withdraw" element={<Wallet />} />
      <Route path="/transaction/:id" element={<Transaction />} />
      <Route path="/transaction/credit" element={<CreditTransactions />} />
      <Route path="/transaction/debit" element={<DebitTransactions />} />
      <Route
        path="/transaction/percentage"
        element={<PercentageTransactions />}
      />
      <Route path="/driver-review" element={<DriverReview />} />
      <Route path="/cancel-driver" element={<DriverCancel />} />

      <Route path="/trip/:id" element={<ViewTrip />} />
      <Route path="/editTrip/:id" element={<EditFareManagementScreen />} />
      <Route path="/cancel-driver" element={<DriverCancel />} />
      <Route path="/fare-list" element={<FareList />} />

      <Route path="/trip/:id/:state" element={<TripStates />} />
      <Route path="/userTrip/:id" element={<ViewUserTrip />} />

      <Route path="/carpoolTrip/:id" element={<ViewUserCarpoolTrip />} />
      <Route path="/userTrip/travel-partner" element={<TravelPartner />} />
      <Route path="/other-category" element={<OtherCategory />} />
      <Route path="/other-services" element={<OtherServices />} />
      <Route path="/other-services/:id" element={<ViewAsPage />} />

      <Route path="/faretrip/:id" element={<EditFareManagementScree2/>}/>

      <Route path="/vehicle/:id" element={<VehiclePage />} />
      <Route path="/vehicle/oneway" element={<OneWayTripsVehicle />} />
      <Route path="/vehicle/carpool" element={<CarpoolTripsVehicle />} />


      <Route path="/carpool/brand-management" element={<BrandManagement />} />
      <Route
        path="/carpool/vechile-namemanagement"
        element={<VehicleNameManagement />}
      />
      <Route path="/carpool/seat-management" element={<ManageVehicleSeats />} />
      <Route path="/seat-management" element={<ManageVehicleSeats />} />

      <Route path="/carpool/available-seats" element={<AvailableSeates />} />


      <Route path="/carpool/editSeat/:id" element={<EditSeat />} />


      <Route
        path="/carpool/available-seats/viewavailale-seat"
        element={<AvailableSeatDetails />}
      />
      <Route path="/carpool/addSeat" element={<AddSeat />} />
      <Route path="/carpool/carpool-awarness" element={<CarpoolAwareness />} />
      <Route
        path="/carpool-awarness/offer-carpool"
        element={<CarpoolOffer />}
      />

      <Route
        path="/carpool/addcarpool-vechile"
        element={<AddCarpoolvechile />}
      />

      <Route path="/transactions/credit" element={<CreditTransaction />} />
      <Route path="/transactions/debit" element={<DebitTransactions />} />
      <Route
        path="/transactions/percentage"
        element={<PercentageTransactions />}
      />

      <Route path="/vechile-category" element={<VechileCategory />} />
      <Route
        path="/vechile-category/add-category-vehicle"
        element={<AddCategoryVehicle />}
      />
      <Route path="/category/:categoryName" element={<SubCategory />} />
      <Route path="/support" element={<ZaoCabSupport />} />
      <Route path="/trip-details/:id" element={<TripDetails />} />
      <Route path="/*" element={<NoFound />} />
    </Routes>
  );
};

export default App;
