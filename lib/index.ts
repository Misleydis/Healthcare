import useAuthStore from "./auth-store"
import usePatientStore from "./patient-store"
import useHealthRecordStore from "./health-record-store"
import useAppointmentStore from "./appointment-store"
import useNotificationStore from "./notification-store"
import useSettingsStore from "./settings-store"
import api from "./api"

export default useAuthStore

export {
  usePatientStore,
  useHealthRecordStore,
  useAppointmentStore,
  useNotificationStore,
  useSettingsStore,
  api,
}
