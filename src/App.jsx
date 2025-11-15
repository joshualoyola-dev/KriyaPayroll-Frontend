import { BrowserRouter, Route, Routes } from "react-router-dom"
import LoginPage from "./pages/auth/LoginPage"
import DashboardPage from "./pages/main/dashboard/Dashboard.page"
import HomePage from "./pages/home/HomePage"
import MainLayout from "./layouts/MainLayout"
import PayrunPage from "./pages/main/payrun/payrun/PayrunPage"
import AttendancePage from "./pages/main/attendance/attendance/AttendancePage"
import AbsencePage from "./pages/main/attendance/absence/AbsencePage"
import LeavePage from "./pages/main/attendance/leave/LeavePage"
import OvertimePage from "./pages/main/attendance/overtime/OvertimePage"
import RestdayPage from "./pages/main/attendance/restday/RestdayPage"
import EmployeePage from "./pages/main/employee/EmployeePage"
import { UserProvider } from "./contexts/UserProvider"
import { CompanyProvider } from "./contexts/CompanyProvider"
import { ToastProvider } from "./contexts/ToastProvider"
import ProtectedRoute from "./routes/ProtectedRoute"
import PublicRoute from "./routes/PublicRoute"
import { EmployeeProvider } from "./contexts/EmployeeProvider"
import { AttendanceProvider } from "./contexts/AttendanceProvider"
import { OvertimeProvider } from "./contexts/OvertimeProvider"
import { LeaveProvider } from "./contexts/LeaveProvider"
import { AbsenceProvider } from "./contexts/AbsenceProvider"
import { RestdayProvider } from "./contexts/RestdayProvider"
import HolidayPage from "./pages/main/attendance/holiday/HolidayPage"
import { HolidayProvider } from "./contexts/HolidayProvider"
import RegularPayrunPage from "./pages/main/payrun/regular/RegularPayrunPage"
import { PayitemProvider } from "./contexts/PayitemProvider"
import { RegularPayrunProvider } from "./contexts/RegularPayrunProvider"
import { RecurringPayProvider } from "./contexts/RecurringPayProvider"
import PayitemPage from "./pages/main/configuration/payitem/PayitemPage"
import CompanyConfigsPage from "./pages/main/configuration/company-configs/CompanyConfigsPage"
import RecurringPayPage from "./pages/main/configuration/recurring-pay/RecurringPayPage"
import LastPayrunPage from "./pages/main/payrun/last/LastPayrunPage"
import SpecialPayrunPage from "./pages/main/payrun/special/SpecialPayrunPage"
import ContributionPage from "./pages/main/configuration/contributions/ContributionPage"
import { ContributionProvider } from "./contexts/ContributionProvider"
import { HdmfProvider } from "./contexts/HdmfProvider"
import { PhicProvider } from "./contexts/PhicProvider"
import { AuthProvider } from "./contexts/AuthProvider"
import { WithholdingProvider } from "./contexts/WithholdingProvider"
import { SssProvider } from "./contexts/SssProvider"
import { PayrunProvider } from "./contexts/PayrunProvider"
import SendPayslipPage from "./pages/main/payrun/payrun/SendPayslipPage"
import { PayslipProvider } from "./contexts/PayslipProvider"
import DataExportPage from "./pages/main/data-export/DataExportPage"
import { ExportProvider } from "./contexts/ExportProvider"
import { YtdProvider } from "./contexts/YtdProvider"
import { SpecialPayrunProvider } from "./contexts/SpecialPayrunProvider"

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider >
          <UserProvider >
            <CompanyProvider >
              <EmployeeProvider>
                <AttendanceProvider >
                  <OvertimeProvider >
                    <LeaveProvider >
                      <AbsenceProvider >
                        <RestdayProvider>
                          <HolidayProvider>
                            <PayitemProvider >
                              <PayrunProvider >
                                <RegularPayrunProvider>
                                  <SpecialPayrunProvider>
                                    <RecurringPayProvider >
                                      <ContributionProvider >
                                        <HdmfProvider >
                                          <PhicProvider>
                                            <WithholdingProvider>
                                              <SssProvider>

                                                <PayslipProvider >
                                                  <ExportProvider >
                                                    <YtdProvider>
                                                      <Routes>
                                                        {/* Public routes */}
                                                        <Route path="/" element={<HomePage />} />
                                                        {/* Navitate to Dasboard if there'? token */}
                                                        <Route element={<PublicRoute />}>
                                                          <Route path="/auth/login" element={<LoginPage />} />
                                                        </Route>

                                                        {/* Protected routes with MainLayout */}
                                                        <Route element={<MainLayout />}>
                                                          <Route element={<ProtectedRoute />} >
                                                            <Route path="/dashboard" element={<DashboardPage />} />

                                                            <Route path="/payrun" element={<PayrunPage />} />
                                                            <Route path="/payrun/regular" element={< RegularPayrunPage />} />
                                                            <Route path="/payrun/special" element={<SpecialPayrunPage />} />
                                                            <Route path="/payrun/last" element={<LastPayrunPage />} />
                                                            <Route path="/payrun/send-payslips" element={< SendPayslipPage />} />


                                                            <Route path="/employee" element={<EmployeePage />} />

                                                            <Route path="/attendance" element={<AttendancePage />} />
                                                            <Route path="/attendance/absence" element={<AbsencePage />} />
                                                            <Route path="/attendance/leave" element={<LeavePage />} />
                                                            <Route path="/attendance/overtime" element={<OvertimePage />} />
                                                            <Route path="/attendance/restday" element={<RestdayPage />} />
                                                            <Route path="/attendance/holiday" element={<HolidayPage />} />


                                                            <Route path="/configuration/payitem" element={<PayitemPage />} />
                                                            <Route path="/configuration/company-configuration" element={<CompanyConfigsPage />} />
                                                            <Route path="/configuration/recurring-pay" element={<RecurringPayPage />} />
                                                            <Route path="/configuration/contribution" element={<ContributionPage />} />

                                                            <Route path="/data-export" element={<DataExportPage />} />
                                                          </Route>
                                                        </Route>
                                                      </Routes>
                                                    </YtdProvider>


                                                  </ExportProvider>
                                                </PayslipProvider>

                                              </SssProvider>
                                            </WithholdingProvider>
                                          </PhicProvider>
                                        </HdmfProvider>
                                      </ContributionProvider>
                                    </RecurringPayProvider>
                                  </SpecialPayrunProvider>
                                </RegularPayrunProvider>
                              </PayrunProvider>
                            </PayitemProvider>
                          </HolidayProvider>
                        </RestdayProvider>
                      </AbsenceProvider>
                    </LeaveProvider>
                  </OvertimeProvider>
                </AttendanceProvider>
              </EmployeeProvider>
            </CompanyProvider>
          </UserProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter >
  )
}

export default App
