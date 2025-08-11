import React,{ useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  DollarSign, 
  Users, 
  FileBarChart2,
  MapPin, 
  Share2, 
  Car, 
  Truck,
  CreditCard,
  Bell,
  MessageSquare,
  Ticket,
  LifeBuoy,
  Wrench,
  UserCircle,
  UserCheck,
  Briefcase,
  AlertTriangle,
  MessagesSquare,
  Building,
  CircleDollarSign,
  ArrowUpRight,    // This was duplicated
  PiggyBank,
  ArrowDownLeft,
  Percent,
  ArrowLeftRight,
  FolderKanban,
  Tag,
  Fuel,
  Armchair,
  Palette,
  CalendarRange,
  Menu,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  ChevronDown,
  Award,
  TicketIcon,
  Receipt,
  Sliders,
  WrenchIcon,
  Database,
  AlignJustify,
  Package,
  Grid,
  Boxes,
  List,
  ReceiptSwissFrancIcon
  
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState({
    users: false, // Initialize the users dropdown as closed
    addfare: false, // Add addfare dropdown state
    payment: false, // Add payment dropdown state
    vechile: false // Add vehicle dropdown state
  });

  // Toggle dropdown expanded state
  const toggleDropdown = (key) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

const menuItems = [
  { title: 'Dashboard', icon: Home, path: '/' },
  { 
    title: 'AddFare',
    icon: Award, 
    key: 'addfare', // Add this key property
    isDropdown: true,
    children: [
      { title: 'Fix fare' ,icon: UserCircle, path: '/addfare' },
      { title: 'Per/km-fare', icon: UserCircle, path: '/addfare/perkm' },
    ]
   },

   {
    title:'Fare-Details',
    icon:TicketIcon,
    path:'/trips'
   }
,
  {
    title: 'Users',
    icon: Users,
    key: 'users',
    isDropdown: true,
    children: [
      { title: 'Passengers', icon: UserCircle, path: '/passenger-travels' },
      { title: 'Drivers', icon: UserCheck, path: '/driver-travels' },
      { title: 'Travels', icon: Building, path: '/driver-travels' }
    ]
  },
    {
    title: 'Report',
    icon: FileBarChart2,
    key: 'report',
    isDropdown: true,
    children: [
      { title: 'Add Reason', icon: ReceiptSwissFrancIcon, path: '/report-reason' },
      { title: 'Report list', icon: AlignJustify, path: '/report-list' },
    ]
  },  { title: 'State & City', icon: MapPin, path: '/stateCity' },
  { title: 'Carpool', icon: Share2, path: '/carpool' },
  { title: 'Passenger Trips', icon: UserCircle, path: '/userTrips' },
  { title: 'Vehicle Trips', icon: Car, path: '/category' },
 {
  title: 'Payment',
  icon: CreditCard,
  key: 'payment',
  isDropdown: true,
  children: [
    { title: 'Withdraw', icon: PiggyBank, path: '/withdraw' },
    { title: 'Debit', icon: ArrowDownLeft, path: '/transactions/debit' },
    { title: 'Credit', icon: ArrowUpRight, path: '/transactions/credit' },
    { title: 'Percentage(p & p)', icon: Percent, path: '/transactions/percentage' },
    { title: 'Transfer min.amt\n(Passenger & Partner)', icon: ArrowLeftRight, path: '/' }
  ]
},
  { title: 'Notifications', icon: Bell, path: '/notifications' },
  { title: 'Feedback', icon: MessageSquare, path: '/feedback' },
  { title: 'Subscription Plan', icon: Ticket, path: '/plan' },
    {
    title: 'Other Services',
    icon: Sliders,
    key: 'other',
    isDropdown: true,
    children: [
      { title: 'Other-list', icon: Database, path: '/other-services' },
      { title: 'Other Category', icon: Grid, path: '/other-category' },
    ]
  },
  { title: 'Support', icon: LifeBuoy, path: '/support' },
  {
    title: 'Vechiles',
    icon: Truck,
    key: 'vechile',
    isDropdown: true,
    children: [
      { title: 'Category', icon: FolderKanban, path: '/vechile-category' },
      { title: 'Name', icon: Tag, path: '/vechile-name' },
      { title: 'Fuel', icon: Fuel, path: '/add-fuel' },
      { title: 'Seats', icon: Armchair, path: '/seat-management' },
      { title: 'Colour', icon: Palette, path: '/color' },
      { title: 'Year', icon: CalendarRange, path: '/add-year' },
    ]
  },


 
  { title: 'SOS', icon: AlertTriangle, path: '/sos' },
  { title: 'Chat', icon: MessagesSquare, path: '/chat' },
];

  const NavItem = ({ icon: Icon, title, path, isDropdown, children, itemKey }) => {
    const isActive = location.pathname === path;
    const isExpanded = itemKey && expandedItems[itemKey];
    
    // Check if any child is active (for dropdown highlighting)
    const isChildActive = children?.some(child => location.pathname === child.path);

    if (isDropdown) {
      return (
        <div className="space-y-1">
          {/* Dropdown header */}
          <button
            onClick={() => toggleDropdown(itemKey)}
            className={`flex items-center justify-between w-full px-4 py-3 text-sm transition-colors duration-200 rounded-lg
              ${isChildActive 
                ? 'bg-blue-50 text-blue-500' 
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-500'
              }
            `}
          >
            <div className="flex items-center">
              <Icon className={`h-5 w-5 ${isChildActive ? 'text-blue-500' : 'text-gray-500'}`} />
              <span className={`ml-3 ${isSidebarOpen ? 'block' : 'hidden'}`}>{title}</span>
            </div>
            {isSidebarOpen && (
              isExpanded ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
            )}
          </button>

          {/* Dropdown children */}
          {isExpanded && isSidebarOpen && (
            <div className="pl-10 space-y-1">
              {children.map(child => (
                <Link
                  key={child.title}
                  to={child.path}
                  className={`flex items-center px-4 py-2 text-sm transition-colors duration-200 rounded-lg
                    ${location.pathname === child.path 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-500'
                    }
                  `}
                >
                  <child.icon className={`h-4 w-4 mr-2 ${location.pathname === child.path ? 'text-white' : 'text-gray-500'}`} />
                  <span>{child.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        to={path}
        className={`flex items-center px-4 py-3 text-sm transition-colors duration-200 rounded-lg
          ${isActive 
            ? 'bg-blue-500 text-white' 
            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-500'
          }
        `}
      >
        <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
        <span className={`ml-3 ${isSidebarOpen ? 'block' : 'hidden'}`}>{title}</span>
      </Link>
    );
  };

  return (
    <div 
      className={`${
        isSidebarOpen ? 'w-64' : 'w-20'
      } transition-all duration-300 fixed inset-y-0 left-0 bg-white border-r border-gray-200 z-30`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {isSidebarOpen && (
            <span className="text-xl font-semibold text-gray-800">AdminPanel</span>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              title={item.title}
              path={item.path}
              isDropdown={item.isDropdown}
              children={item.children}
              itemKey={item.key}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-1">
            <Link
              to="/settings"
              className="flex items-center px-4 py-3 text-sm text-gray-600 transition-colors duration-200 rounded-lg hover:bg-gray-100"
            >
              <Settings className="h-5 w-5 text-gray-500" />
              <span className={`ml-3 ${isSidebarOpen ? 'block' : 'hidden'}`}>Settings</span>
            </Link>
            <Link
              to="/help"
              className="flex items-center px-4 py-3 text-sm text-gray-600 transition-colors duration-200 rounded-lg hover:bg-gray-100"
            >
              <HelpCircle className="h-5 w-5 text-gray-500" />
              <span className={`ml-3 ${isSidebarOpen ? 'block' : 'hidden'}`}>Help Center</span>
            </Link>
            <button
              className="flex items-center w-full px-4 py-3 text-sm text-red-600 transition-colors duration-200 rounded-lg hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              <span className={`ml-3 ${isSidebarOpen ? 'block' : 'hidden'}`}>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;