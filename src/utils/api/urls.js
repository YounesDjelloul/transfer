const API_URLs = {}

API_URLs.REGISTRATION = '/api/auth/register/'
API_URLs.PASSWORD__CHANGE = '/api/auth/password/change/'
API_URLs.LOGIN = '/api/auth/login/'
API_URLs.CURRENT_USER_PROFILE = '/api/auth/user/'
API_URLs.NEW_ACCESS_TOKEN = '/api/auth/token/refresh/'
API_URLs.CLIENTS = '/api/clients/'
API_URLs.EMPLOYEES = '/api/employees/'
API_URLs.MATTERS = '/api/matters/'
API_URLs.COMPANIES = '/api/companies/'
API_URLs.CONTACTS = '/api/contacts/'
API_URLs.USERS = '/api/users/'

API_URLs.JOB_TITLES = '/api/users/job_titles/'

API_URLs.CUSTOM_FIELDS = '/api/custom_fields/'

API_URLs.MATTERS__PRACTICE_AREA = '/api/matters_/practice_area/'

API_URLs.BILLING__INVOICES   = '/api/billing/invoices/'
API_URLs.BILLING__PRICES     = '/api/billing/prices/'
API_URLs.BILLING__CURRENCY   = '/api/billing/currency/'
API_URLs.BILLING__SALE_TAXES = '/api/billing/sale_taxes/'

API_URLs.ACTIVITIES__ACTIVITY_ITEMS = '/api/activities/activity_items/'
API_URLs.ACTIVITIES__EXPENSES       = '/api/activities/expenses/'
API_URLs.ACTIVITIES__FLAT_FEES      = '/api/activities/flat_fees/'
API_URLs.ACTIVITIES__TIME_ENTRIES   = '/api/activities/time_entries/'

export default API_URLs
