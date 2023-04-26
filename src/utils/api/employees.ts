import { useApi } from '/@src/composable/useApi'
import API_URLs from '/@src/utils/api/urls'

const api = useApi()

export async function getEmployees(pageQuery) {

	const { data: data } = await api.get(API_URLs.EMPLOYEES + pageQuery)
	return data
}

export async function createNewEmployee(body: object) {
	
	return await api.post(API_URLs.EMPLOYEES, body)
}

export async function getEmployeeDetails(employeePk: string) {

	const { data: data } = await api.get(API_URLs.EMPLOYEES+employeePk)
	return data
}

export async function deleteEmployeeRequest(employeePk: string) {

	const response = await api.delete(API_URLs.EMPLOYEES+employeePk)
}

export async function updateEmployeeDetailsRequest(employeePk: string, body: object, methodAllowed: string) {
	return await api[methodAllowed](API_URLs.EMPLOYEES+employeePk+'/', body)
}

export async function getEmployeeSchemas() {

	const { data } = await api.options(API_URLs.EMPLOYEES)
	return data
}

export async function getFieldChoices(endpointUrl, searchKeyword) {
	const { data } = await api.get(`${endpointUrl}?search=${searchKeyword}`)
	return data.results
}