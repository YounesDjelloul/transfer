import { useApi } from '/@src/composable/useApi'
import API_URLs from '/@src/utils/api/urls'

const api = useApi()

export async function getCompanies(pageQuery) {

	const { data: data } = await api.get(API_URLs.COMPANIES + pageQuery)
	return data
}

export async function createNewCompany(body: object) {
	
	return await api.post(API_URLs.COMPANIES, body)
}

export async function getCompanyDetails(companyPk: string) {

	const { data: data } = await api.get(API_URLs.COMPANIES+companyPk)
	return data
}

export async function deleteCompanyRequest(companyPk: string) {

	const response = await api.delete(API_URLs.COMPANIES+companyPk)
}

export async function updateCompanyDetailsRequest(companyPk: string, body: object, methodAllowed: string) {
	return await api[methodAllowed](API_URLs.COMPANIES+companyPk+'/', body)
}

export async function getCompanySchemas() {

	const { data } = await api.options(API_URLs.COMPANIES)
	return data
}

export async function getFieldChoices(endpointUrl, searchKeyword) {
	const { data } = await api.get(`${endpointUrl}?search=${searchKeyword}`)
	return data.results
}