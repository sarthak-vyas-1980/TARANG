// Auth pages
export { Login, Signup } from './auth';

// Dashboard pages
export { Dashboard } from './dashboard';

// Profile pages
export { Profile } from './profile';

// Reports pages
export { 
  ReportsPage, 
  CreateReport, 
  EditReport, 
  ViewReport, 
  MyReports 
} from './reports';

// Re-export with more descriptive names for convenience
export { 
  Login as LoginPage,
  Signup as SignupPage,
  Dashboard as DashboardPage,
  Profile as ProfilePage,
  ReportsPage as AllReportsPage,
  CreateReport as CreateReportPage,
  EditReport as EditReportPage,
  ViewReport as ViewReportPage,
  MyReports as MyReportsPage
} from './auth';

// Group exports by feature for organized imports
export const AuthPages = {
  Login,
  Signup
} from './auth';

export const ReportPages = {
  List: ReportsPage,
  Create: CreateReport,
  Edit: EditReport,
  View: ViewReport,
  MyReports
} from './reports';

export const CorePages = {
  Dashboard,
  Profile
} from './dashboard';
